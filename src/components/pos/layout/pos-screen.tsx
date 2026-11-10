import type { Section } from "@/config/sections"
import { getItemCount, getTicketTotal } from "@/lib/ticket"
import type {
  Cashier,
  PausedTicket,
  Product,
  ScanStatus,
  TicketLine,
} from "@/types/pos"

import { CheckoutPanel, type CheckoutPanelProps } from "../checkout"
import { PosHeader, ScanNotice } from "../header"
import { ShortcutsBar } from "../shortcuts"
import type { SectionCatalogState } from "../sections"
import { TicketPanel, type ProductSearchState } from "../ticket"

export type PosScreenProps = {
  cashier: Cashier
  lines: TicketLine[]
  pausedTickets: PausedTicket[]
  /** Producto «bolsa» que añade el botón *Bolsa*. */
  bagProduct: Product
  /** Estado del buscador: texto, resultados, carga y error. */
  search?: ProductSearchState
  /** Estado de las secciones: catálogo de la sección abierta y báscula. */
  sections?: SectionCatalogState
  selectedLineId?: string
  /** Estado del teclado numérico. En la app lo pone `PosApp` (`useQuantityEntry`). */
  numpad?: CheckoutPanelProps["numpad"]
  /** Teclas en pantalla del producto seleccionado desplegadas (control externo). */
  keypadOpen?: boolean
  onKeypadOpenChange?: (open: boolean) => void
  /** Fecha y hora del reloj. */
  date?: Date | null
  /** Producto elegido (buscador o sección). `quantity`: unidades o kg; por defecto, 1. */
  onAddProduct?: (product: Product, quantity?: number) => void
  onSelectLine?: (lineId: string) => void
  onChangeQuantity?: (lineId: string, quantity: number) => void
  onRemoveLine?: (lineId: string) => void
  /** Confirmación de eliminar la línea seleccionada (control externo, con Supr). */
  confirmingRemoval?: boolean
  onConfirmingRemovalChange?: (confirming: boolean) => void
  /** Modal de búsqueda abierto (control externo, con F2). */
  searchOpen?: boolean
  onSearchOpenChange?: (open: boolean) => void
  /** Sección abierta (control externo, con F5–F7). */
  openSection?: Section | null
  onOpenSectionChange?: (section: Section | null) => void
  /** Confirmación de pausa abierta (control externo, con F4). */
  isConfirmingPause?: boolean
  onConfirmingPauseChange?: (open: boolean) => void
  /** Lectura de la pistola en curso: aviso *Leyendo código…* en la cabecera. */
  scanStatus?: ScanStatus | null
  /** Pausar la compra en curso (ya confirmado por el cajero). */
  onPauseTicket?: () => void
  /** Anular la compra en curso (ya confirmado por el cajero). */
  onClearTicket?: () => void
  /** Botón *Cobrar*: abre el flujo de pago. */
  onCharge?: () => void
  /** Recuperar una compra en pausa (si hay una en curso, se pausa antes). */
  onRestoreTicket?: (ticketId: string) => void
  onLock?: () => void
  onLogout?: () => void
}

/**
 * Pantalla principal del TPV: barra superior, ticket (≈70 %), panel de cobro (≈30 %) y barra de
 * atajos. Es solo interfaz: recibe el ticket y el estado de cada zona por props y avisa con
 * callbacks. En la app la conecta `PosApp` (`src/features/pos-app`). Solo escritorio: ocupa toda la ventana con un ancho mínimo de 1280 px. La página nunca
 * hace scroll: si la ventana es baja, el ticket y el panel de cobro hacen scroll cada uno en su
 * columna.
 */
export function PosScreen({
  cashier,
  lines,
  pausedTickets,
  bagProduct,
  search,
  sections,
  selectedLineId,
  numpad,
  keypadOpen,
  onKeypadOpenChange,
  date,
  onAddProduct,
  onSelectLine,
  onChangeQuantity,
  onRemoveLine,
  confirmingRemoval,
  onConfirmingRemovalChange,
  searchOpen,
  onSearchOpenChange,
  isConfirmingPause,
  onConfirmingPauseChange,
  openSection,
  onOpenSectionChange,
  scanStatus,
  onPauseTicket,
  onClearTicket,
  onCharge,
  onRestoreTicket,
  onLock,
  onLogout,
}: PosScreenProps) {
  const total = getTicketTotal(lines)
  const itemCount = getItemCount(lines)

  return (
    <div className="grid h-screen min-w-7xl grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto] bg-background">
      <PosHeader
        cashier={cashier}
        pausedTickets={pausedTickets}
        date={date}
        onRestoreTicket={onRestoreTicket}
        currentTicket={lines.length > 0 ? { itemCount, total } : null}
        onLock={onLock}
        onLogout={onLogout}
        notice={
          scanStatus?.state === "searching" && (
            <ScanNotice ean={scanStatus.ean} />
          )
        }
      />
      <div className="grid min-h-0 grid-cols-[7fr_3fr]">
        {/* Sin padding: el buscador y la tabla del ticket van de borde a borde. */}
        <main className="min-h-0">
          <TicketPanel
            lines={lines}
            search={search}
            selectedLineId={selectedLineId}
            onAddProduct={onAddProduct}
            onSelectLine={onSelectLine}
            onChangeQuantity={onChangeQuantity}
            onRemoveLine={onRemoveLine}
            confirmingRemoval={confirmingRemoval}
            onConfirmingRemovalChange={onConfirmingRemovalChange}
            searchOpen={searchOpen}
            onSearchOpenChange={onSearchOpenChange}
          />
        </main>
        {/* En ventanas bajas, el panel de cobro hace scroll dentro de su columna. Sin padding: lo
            pone el panel en su contenido, para que su franja fija llegue al borde. */}
        <aside className="min-h-0 overflow-y-auto overscroll-contain border-l">
          <CheckoutPanel
            total={total}
            itemCount={itemCount}
            selectedLine={lines.find((line) => line.id === selectedLineId)}
            bagCount={lines
              .filter((line) => line.product.id === bagProduct.id)
              .reduce((count, line) => count + line.quantity, 0)}
            bagProduct={bagProduct}
            sections={sections}
            onAddProduct={onAddProduct}
            numpad={numpad}
            keypadOpen={keypadOpen}
            onKeypadOpenChange={onKeypadOpenChange}
            onPauseTicket={onPauseTicket}
            isConfirmingPause={isConfirmingPause}
            openSection={openSection}
            onOpenSectionChange={onOpenSectionChange}
            onConfirmingPauseChange={onConfirmingPauseChange}
            onClearTicket={onClearTicket}
            onCharge={onCharge}
          />
        </aside>
      </div>
      <ShortcutsBar variant={lines.length > 0 ? "ticket" : "empty"} />
    </div>
  )
}
