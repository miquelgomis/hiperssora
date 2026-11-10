"use client"

import { useState } from "react"

import { Separator } from "@/components/ui/separator"
import type { Section } from "@/config/sections"
import { useControllableState } from "@/components/hooks"
import type { Product, TicketLine } from "@/types/pos"

import { SectionCatalog, type SectionCatalogState } from "../sections"
import { AddBagButton } from "./add-bag-button"
import { ClearTicketDialog } from "./clear-ticket-dialog"
import type { NumpadProps } from "./numpad"
import { PauseTicketDialog } from "./pause-ticket-dialog"
import { SelectedLinePanel } from "./selected-line-panel"
import { TicketActions } from "./ticket-actions"
import { TicketTotal } from "./ticket-total"
import { ChargeButton } from "./charge-button"

export type CheckoutPanelProps = {
  total: number
  itemCount: number
  /** Línea seleccionada del ticket: la que modifica el teclado numérico. */
  selectedLine?: TicketLine
  /** Producto «bolsa»: el botón *Bolsa* lo añade al carrito. */
  bagProduct: Product
  /** Bolsas que ya lleva la compra (contador del botón *Bolsa*). */
  bagCount?: number
  /** Estado de las secciones: catálogo de la sección abierta y báscula. */
  sections?: SectionCatalogState
  /** Producto añadido desde el panel (bolsa o sección); `quantity`: unidades o kg. */
  onAddProduct?: (product: Product, quantity?: number) => void
  /** Estado del teclado numérico (visor, edición, teclas). */
  numpad?: Omit<NumpadProps, "className">
  /** Teclas en pantalla del producto seleccionado desplegadas (control externo). */
  keypadOpen?: boolean
  onKeypadOpenChange?: (open: boolean) => void
  /** "Sí, pausar" tras confirmar: la compra pasa a *Clientes en pausa*. */
  onPauseTicket?: () => void
  /** Sección abierta (control externo, con F5–F7). */
  openSection?: Section | null
  onOpenSectionChange?: (section: Section | null) => void
  /** Confirmación de pausa abierta (control externo, p. ej., con F4). */
  isConfirmingPause?: boolean
  onConfirmingPauseChange?: (open: boolean) => void
  /** "Sí, anular compra" tras confirmar: se vacía el ticket. */
  onClearTicket?: () => void
  onCharge?: () => void
}

/**
 * Columna derecha del TPV. Cabe entera sin scroll y separa el alcance de cada acción:
 *
 * 1. **Compra**, arriba: total, *Cobrar* y, debajo, *Pausar compra* y *Anular compra*.
 * 2. **Añadir:** las secciones (Frutería, Verdulería, Panadería), en botones grandes, y
 *    *Bolsa*, más discreto y con contador.
 * 3. **Producto seleccionado** (`SelectedLinePanel`), fijo al pie y en gris claro: la cantidad
 *    de la línea seleccionada, con su foto y nombre. Solo aparece (deslizándose desde abajo)
 *    cuando hay una línea seleccionada o un multiplicador pendiente. Las teclas en pantalla van plegadas (la caja tiene
 *    teclado físico) y, al desplegarse, la franja crece hacia arriba.
 */
export function CheckoutPanel({
  total,
  itemCount,
  selectedLine,
  bagProduct,
  bagCount,
  sections,
  onAddProduct,
  numpad,
  keypadOpen,
  onKeypadOpenChange,
  onPauseTicket,
  openSection,
  onOpenSectionChange,
  isConfirmingPause: isConfirmingPauseProp,
  onConfirmingPauseChange,
  onClearTicket,
  onCharge,
}: CheckoutPanelProps) {
  const [isConfirmingPause, setIsConfirmingPause] = useControllableState(
    isConfirmingPauseProp,
    onConfirmingPauseChange,
    false
  )
  const [isConfirmingClear, setIsConfirmingClear] = useState(false)
  const isEmpty = itemCount === 0
  const hasSelection = Boolean(selectedLine || numpad?.isMultiplying)

  function handleConfirmPause() {
    setIsConfirmingPause(false)
    onPauseTicket?.()
  }

  function handleConfirmClear() {
    setIsConfirmingClear(false)
    onClearTicket?.()
  }

  return (
    <section aria-label="Cobro" className="flex min-h-full flex-col">
      {/*
        Ritmo único: 8 px entre botones (en horizontal y en vertical) y 16 px con una línea
        entre bloques. Alturas: 64 px Cobrar (principal), 80 px secciones, 56 px el resto.
      */}
      <div className="flex flex-col gap-4 p-6 short:p-5">
        {/* Compra: total, Cobrar y sus acciones secundarias */}
        <div className="flex flex-col gap-2">
          <TicketTotal total={total} itemCount={itemCount} className="mb-2" />
          <ChargeButton disabled={isEmpty} onCharge={onCharge} />
          <TicketActions
            disabled={isEmpty}
            onPause={() => setIsConfirmingPause(true)}
            onClear={() => setIsConfirmingClear(true)}
          />
        </div>

        <Separator />

        {/* Añadir: secciones (grandes) y bolsa (secundaria) */}
        <div className="flex flex-col gap-2">
          <SectionCatalog
            {...sections}
            onSelect={onAddProduct}
            section={openSection}
            onSectionChange={onOpenSectionChange}
          />
          <AddBagButton
            price={bagProduct.price}
            count={bagCount}
            onClick={() => onAddProduct?.(bagProduct)}
          />
        </div>
      </div>

      {/*
        Producto seleccionado: fijo al pie, de borde a borde. Solo aparece cuando hay algo sobre
        lo que actuar (una línea seleccionada o un multiplicador pendiente), deslizándose.
      */}
      {hasSelection && (
        <SelectedLinePanel
          line={selectedLine}
          numpad={numpad}
          keypadOpen={keypadOpen}
          onKeypadOpenChange={onKeypadOpenChange}
          className="sticky bottom-0 mt-auto animate-in px-6 py-4 duration-300 fade-in-0 slide-in-from-bottom-4 short:py-3"
        />
      )}

      <PauseTicketDialog
        open={isConfirmingPause}
        total={total}
        itemCount={itemCount}
        onOpenChange={setIsConfirmingPause}
        onConfirm={handleConfirmPause}
      />
      <ClearTicketDialog
        open={isConfirmingClear}
        total={total}
        itemCount={itemCount}
        onOpenChange={setIsConfirmingClear}
        onConfirm={handleConfirmClear}
      />
    </section>
  )
}
