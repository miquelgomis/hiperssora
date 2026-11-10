"use client"

import { useState } from "react"

import { PosScreen, type PosScreenProps } from "@/components/pos/layout"
import { LockScreen, type LockScreenVariant } from "@/components/pos/lock"
import { CheckoutFlow } from "@/components/pos/payment"
import {
  AgeVerificationDialog,
  ProductNotFoundDialog,
} from "@/components/pos/ticket"
import { DEMO_PIN } from "@/config/auth"
import { sections, type Section } from "@/config/sections"
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner"
import { useCheckout } from "@/hooks/use-checkout"
import { useNow } from "@/hooks/use-now"
import { usePausedTickets } from "@/hooks/use-paused-tickets"
import { usePersistentState } from "@/hooks/use-persistent-state"
import { usePosKeyboard } from "@/hooks/use-pos-keyboard"
import { useProductSearch } from "@/hooks/use-product-search"
import { useQuantityEntry } from "@/hooks/use-quantity-entry"
import { useScale } from "@/hooks/use-scale"
import { useSectionCatalog } from "@/hooks/use-section-catalog"
import { useTicket } from "@/hooks/use-ticket"
import {
  fetchProducts,
  fetchSectionCatalog,
  type ProductSearchFn,
  type SectionCatalogFn,
} from "@/lib/product-api"
import { SCALE_MOCKUP_NOTE } from "@/lib/scale"
import { findLineByEan, getQuantityStep, getTicketTotal } from "@/lib/ticket"
import type { PausedTicket, Product, ScanStatus, TicketLine } from "@/types/pos"

export type PosAppProps = Omit<
  PosScreenProps,
  | "lines"
  | "selectedLineId"
  | "onAddProduct"
  | "onSelectLine"
  | "onChangeQuantity"
  | "onRemoveLine"
  | "numpad"
  | "pausedTickets"
  | "onPauseTicket"
  | "onClearTicket"
  | "onCharge"
  | "onRestoreTicket"
  | "scanStatus"
  | "onLock"
  | "onLogout"
  | "confirmingRemoval"
  | "onConfirmingRemovalChange"
  | "searchOpen"
  | "onSearchOpenChange"
  | "isConfirmingPause"
  | "onConfirmingPauseChange"
  | "openSection"
  | "onOpenSectionChange"
  | "search"
  | "sections"
  | "keypadOpen"
  | "onKeypadOpenChange"
> & {
  /**
   * Búsqueda de productos (buscador y pistola). Por defecto, el catálogo real de Nutriinfo
   * (`/api/products`). Las stories pasan una simulada.
   */
  search?: ProductSearchFn
  /** Carga del catálogo de las secciones. Por defecto, el real de Nutriinfo. */
  loadSection?: SectionCatalogFn
  /** Compras en pausa al arrancar. Por defecto, ninguna. */
  initialPausedTickets?: PausedTicket[]
  /** Líneas con las que arranca el ticket. Por defecto, vacío. */
  initialLines?: TicketLine[]
  /**
   * Clave para guardar el ticket y las compras en pausa en localStorage, de modo que
   * sobrevivan a recargas. Sin clave, el estado solo vive en memoria (stories).
   */
  storageKey?: string
  /** Estado de bloqueo inicial. Por defecto, `welcome`: cada turno empieza bloqueado. */
  initialLock?: LockScreenVariant | null
}

/**
 * Aplicación del TPV. Es la capa que **conecta** el sistema de diseño (`src/components`, solo
 * interfaz) con los datos y la lógica: el estado (hooks de `src/hooks`), el catálogo de
 * Nutriinfo, la báscula y el datáfono simulados, el PIN y localStorage. Pinta `PosScreen` con
 * todo su estado, el flujo de cobro, los avisos de la pistola y la pantalla de bloqueo.
 *
 * - Al entrar, la caja está bloqueada con la bienvenida al cajero.
 * - *Bloquear pantalla* (modal del cajero) vuelve a bloquearla y el PIN correcto la desbloquea.
 * - El ticket empieza vacío. Los productos elegidos en el buscador o leídos con la pistola se
 *   encolan al final (si ya están, se suma 1 a su cantidad). La línea seleccionada se
 *   despliega para cambiar la cantidad o eliminarla, y el teclado numérico muestra y fija
 *   su cantidad.
 * - El primer producto +18 (alcohol) de cada compra pide confirmar que el cliente es mayor de
 *   edad; una vez confirmado, el resto entran directamente.
 * - *Cobrar* abre el flujo de pago (`CheckoutFlow`); al terminar, *Nueva venta* vacía la caja.
 * - *Anular compra* (con confirmación) vacía la caja para empezar de cero.
 * - Con `storageKey`, el ticket y las compras en pausa se guardan en localStorage.
 * - Todo se maneja también con el teclado físico (`usePosKeyboard`): ↑/↓, +/−, Supr, F1–F4,
 *   F5–F7 (secciones), dígitos + Enter, `*` para multiplicar y Esc.
 * - *Pausar* (con confirmación) aparca la compra en *Clientes en pausa* y libera la caja; desde
 *   ahí se recupera; si hay una compra en curso, se pausa a la vez (intercambio). Al arrancar
 *   no hay ninguna en pausa.
 */
export function PosApp({
  initialLines = [],
  initialPausedTickets = [],
  storageKey,
  initialLock = "welcome",
  search = fetchProducts,
  loadSection = fetchSectionCatalog,
  date,
  ...screenProps
}: PosAppProps) {
  const now = useNow()
  const [lock, setLock] = useState<LockScreenVariant | null>(initialLock)
  const [scanStatus, setScanStatus] = useState<ScanStatus | null>(null)
  const ticket = useTicket(
    initialLines,
    storageKey ? `${storageKey}:ticket` : null
  )
  const paused = usePausedTickets(
    initialPausedTickets,
    storageKey ? `${storageKey}:paused` : null
  )
  const [isCharging, setIsCharging] = useState(false)
  const checkout = useCheckout()
  const productSearch = useProductSearch(search)
  // Preferencia del cajero: teclas en pantalla desplegadas o no.
  const [isKeypadOpen, setIsKeypadOpen] = usePersistentState(
    storageKey ? `${storageKey}:keypad-open` : null,
    false
  )
  const [pendingAdd, setPendingAdd] = useState<{
    product: Product
    quantity: number
  } | null>(null)
  const selectedLine = ticket.lines.find(
    (line) => line.id === ticket.selectedLineId
  )
  const quantityEntry = useQuantityEntry(selectedLine, ticket.changeQuantity)
  // Estados que también se abren desde el teclado físico (F2, F4, Supr).
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isConfirmingPause, setIsConfirmingPause] = useState(false)
  const [openSection, setOpenSection] = useState<Section | null>(null)
  const [weighing, setWeighing] = useState<Product | null>(null)
  const sectionCatalog = useSectionCatalog(loadSection, openSection)
  const scale = useScale(weighing)
  const [confirmingRemovalId, setConfirmingRemovalId] = useState<string | null>(
    null
  )
  const isConfirmingRemoval =
    confirmingRemovalId !== null &&
    confirmingRemovalId === ticket.selectedLineId

  function setConfirmingRemoval(confirming: boolean) {
    setConfirmingRemovalId(confirming ? (ticket.selectedLineId ?? null) : null)
  }

  /**
   * Punto único de entrada al ticket. Sin cantidad explícita, usa el multiplicador del
   * teclado numérico (o 1). El primer producto +18 pide verificar la edad.
   */
  function requestAdd(product: Product, explicitQuantity?: number) {
    const quantity = explicitQuantity ?? quantityEntry.takeMultiplier() ?? 1
    if (product.ageRestricted && !ticket.isAgeVerified) {
      setPendingAdd({ product, quantity })
    } else {
      ticket.addProduct(product, quantity)
    }
  }

  function confirmAge() {
    if (!pendingAdd) return
    ticket.verifyAge()
    ticket.addProduct(pendingAdd.product, pendingAdd.quantity)
    setPendingAdd(null)
  }

  async function handleScan(ean: string) {
    // Los dígitos de la pistola también llegan al teclado numérico: se descartan.
    quantityEntry.discardDraft()
    // Si ya está en el ticket, se suma sin consultar la API: ya tenemos sus datos.
    const existing = findLineByEan(ticket.lines, ean)
    if (existing) {
      requestAdd(existing.product)
      return
    }
    setScanStatus({ state: "searching", ean })
    try {
      const [product] = await search(ean)
      if (product) {
        requestAdd(product)
        setScanStatus(null)
      } else {
        setScanStatus({ state: "not-found", ean })
      }
    } catch {
      setScanStatus({ state: "error", ean })
    }
  }

  // La pistola se registra antes que el teclado, para que su Enter tenga prioridad.
  useBarcodeScanner({ onScan: handleScan, enabled: !lock })
  usePosKeyboard(
    {
      lines: ticket.lines,
      selectedLineId: ticket.selectedLineId,
      selectLine: ticket.selectLine,
      numpad: quantityEntry,
      isConfirmingRemoval,
      setConfirmingRemoval,
      removeSelectedLine: () => {
        if (ticket.selectedLineId) ticket.removeLine(ticket.selectedLineId)
      },
      stepSelectedQuantity: (direction) => {
        if (!selectedLine) return
        const step = getQuantityStep(selectedLine.product.unit)
        const next = selectedLine.quantity + direction * step
        // Igual que el botón −: por debajo de un paso, pide confirmar la eliminación.
        if (next < step / 2) setConfirmingRemoval(true)
        else ticket.changeQuantity(selectedLine.id, next)
      },
      openSearch: () => setIsSearchOpen(true),
      charge: () => setIsCharging(true),
      addBag: () => requestAdd(screenProps.bagProduct),
      pauseTicket: () => setIsConfirmingPause(true),
      openSection: (sectionId) =>
        setOpenSection(
          sections.find((section) => section.id === sectionId) ?? null
        ),
      dismissNotice: () => setScanStatus(null),
    },
    !lock
  )

  return (
    <>
      <PosScreen
        {...screenProps}
        date={date ?? now}
        search={{
          query: productSearch.query,
          onQueryChange: productSearch.setQuery,
          results: productSearch.results,
          isLoading: productSearch.isLoading,
          hasError: productSearch.hasError,
        }}
        sections={{
          ...sectionCatalog,
          weighing,
          onWeighingChange: setWeighing,
          weight: scale.weight,
          onReweigh: scale.reweigh,
          scaleMockupNote: SCALE_MOCKUP_NOTE,
        }}
        keypadOpen={isKeypadOpen}
        onKeypadOpenChange={setIsKeypadOpen}
        lines={ticket.lines}
        selectedLineId={ticket.selectedLineId}
        onAddProduct={requestAdd}
        onSelectLine={ticket.selectLine}
        onChangeQuantity={ticket.changeQuantity}
        onRemoveLine={ticket.removeLine}
        numpad={quantityEntry.numpad}
        confirmingRemoval={isConfirmingRemoval}
        onConfirmingRemovalChange={setConfirmingRemoval}
        searchOpen={isSearchOpen}
        onSearchOpenChange={setIsSearchOpen}
        isConfirmingPause={isConfirmingPause}
        onConfirmingPauseChange={setIsConfirmingPause}
        openSection={openSection}
        onOpenSectionChange={setOpenSection}
        pausedTickets={paused.tickets}
        onPauseTicket={() => {
          paused.pause(ticket.lines)
          ticket.replaceLines([])
        }}
        onClearTicket={() => ticket.replaceLines([])}
        onCharge={() => setIsCharging(true)}
        onRestoreTicket={(ticketId) =>
          ticket.replaceLines(paused.take(ticketId, ticket.lines))
        }
        scanStatus={scanStatus}
        onLock={() => setLock("locked")}
        // Cerrar sesión lleva a la pantalla de bloqueo, con la bienvenida de una sesión nueva.
        onLogout={() => setLock("welcome")}
      />
      <CheckoutFlow
        open={isCharging}
        step={checkout.step}
        onStepChange={checkout.setStep}
        total={getTicketTotal(ticket.lines)}
        onCancel={() => setIsCharging(false)}
        onComplete={() => {
          setIsCharging(false)
          ticket.replaceLines([])
        }}
      />
      <ProductNotFoundDialog
        status={
          scanStatus && scanStatus.state !== "searching"
            ? { state: scanStatus.state, ean: scanStatus.ean }
            : null
        }
        onSearch={() => {
          setScanStatus(null)
          setIsSearchOpen(true)
        }}
        onRetry={() => scanStatus && handleScan(scanStatus.ean)}
        onClose={() => setScanStatus(null)}
      />
      <AgeVerificationDialog
        product={pendingAdd?.product ?? null}
        onConfirm={confirmAge}
        onCancel={() => setPendingAdd(null)}
      />
      {lock && (
        <LockScreen
          key={lock}
          cashier={screenProps.cashier}
          variant={lock}
          date={date ?? now}
          // Maqueta: el PIN es el mismo para todos y se muestra en pantalla a propósito.
          verifyPin={(pin) => pin === DEMO_PIN}
          pinLength={DEMO_PIN.length}
          demoPin={DEMO_PIN}
          onUnlock={() => setLock(null)}
        />
      )}
    </>
  )
}
