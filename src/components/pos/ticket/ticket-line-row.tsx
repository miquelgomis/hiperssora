"use client"

import { useEffect, useRef } from "react"

import { ProductThumbnail } from "@/components/common"
import { formatPrice, formatQuantity, formatUnitPrice } from "@/lib/format"
import { getLineTotal } from "@/lib/ticket"
import { cn } from "@/lib/utils"
import type { TicketLine } from "@/types/pos"

import { ProductLabel } from "./product-label"
import { TICKET_GRID } from "./ticket-grid"
import { TicketLineEditor } from "./ticket-line-editor"

export type TicketLineRowProps = {
  line: TicketLine
  /**
   * Línea seleccionada: se resalta y se despliega `TicketLineEditor` debajo. Solo hay una a la
   * vez; por defecto, la última añadida.
   */
  selected?: boolean
  onSelect?: (lineId: string) => void
  onChangeQuantity?: (lineId: string, quantity: number) => void
  onRemove?: (lineId: string) => void
  /** Pidiendo confirmación para eliminar (control externo, p. ej., con Supr). */
  confirmingRemoval?: boolean
  onConfirmingRemovalChange?: (confirming: boolean) => void
}

/**
 * Fila del ticket: foto, nombre con el EAN debajo, cantidad, precio unitario e importe.
 * Al tocarla se selecciona y se despliega para editar la cantidad o eliminarla.
 */
export function TicketLineRow({
  line,
  selected = false,
  onSelect,
  onChangeQuantity,
  onRemove,
  confirmingRemoval,
  onConfirmingRemovalChange,
}: TicketLineRowProps) {
  const { product, quantity } = line
  const ref = useRef<HTMLLIElement>(null)

  // La línea seleccionada (p. ej., la recién añadida) siempre queda a la vista, desplegada.
  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ block: "nearest" })
  }, [selected, quantity])

  return (
    <li
      ref={ref}
      aria-current={selected || undefined}
      className={cn(
        "animate-in border-b duration-300 fade-in-0",
        selected && "bg-brand-soft shadow-[inset_4px_0_0_var(--brand)]"
      )}
    >
      <button
        type="button"
        aria-expanded={selected}
        onClick={() => onSelect?.(line.id)}
        className={cn(
          TICKET_GRID,
          "h-18 w-full text-left text-base transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
          !selected && "hover:bg-muted/50"
        )}
      >
        <ProductThumbnail src={product.imageUrl} alt={product.name} />
        <ProductLabel product={product} />
        <span className="text-right tabular-nums">
          {formatQuantity(quantity, product.unit)}
        </span>
        <span className="text-right text-muted-foreground tabular-nums">
          {formatUnitPrice(product.price, product.unit)}
        </span>
        <span className="text-right font-semibold tabular-nums">
          {formatPrice(getLineTotal(line))}
        </span>
      </button>

      {selected && (
        <TicketLineEditor
          line={line}
          onChangeQuantity={onChangeQuantity}
          onRemove={onRemove}
          confirming={confirmingRemoval}
          onConfirmingChange={onConfirmingRemovalChange}
        />
      )}
    </li>
  )
}
