"use client"

import { Trash2 } from "lucide-react"

import { QuantityStepper } from "@/components/common"
import { Button } from "@/components/ui/button"
import { useControllableState } from "@/components/hooks"
import { formatQuantity } from "@/lib/format"
import { getQuantityStep } from "@/lib/ticket"
import { cn } from "@/lib/utils"
import type { TicketLine } from "@/types/pos"

import { RemoveLineConfirm } from "./remove-line-confirm"
import { TICKET_NAME_INDENT } from "./ticket-grid"

export type TicketLineEditorProps = {
  line: TicketLine
  onChangeQuantity?: (lineId: string, quantity: number) => void
  onRemove?: (lineId: string) => void
  /** Empieza pidiendo confirmación para eliminar (útil para documentar). */
  defaultConfirming?: boolean
  /** Control externo de la confirmación (p. ej., pedirla con Supr). */
  confirming?: boolean
  onConfirmingChange?: (confirming: boolean) => void
  className?: string
}

/**
 * Franja de edición que se despliega bajo la línea seleccionada del ticket: *Eliminar* a la
 * izquierda, bajo el nombre, y − / + para la cantidad (1 unidad o 100 g) a la derecha, del
 * lado de las cantidades y los precios. Eliminar, o bajar de la cantidad mínima con −,
 * pide confirmación en la propia franja, sin abrir un modal.
 */
export function TicketLineEditor({
  line,
  onChangeQuantity,
  onRemove,
  defaultConfirming = false,
  confirming,
  onConfirmingChange,
  className,
}: TicketLineEditorProps) {
  const [isConfirming, setIsConfirming] = useControllableState(
    confirming,
    onConfirmingChange,
    defaultConfirming
  )
  const { product, quantity } = line
  const step = getQuantityStep(product.unit)

  function decrease() {
    // Por debajo de un paso, restar equivale a eliminar la línea.
    if (quantity - step < step / 2) setIsConfirming(true)
    else onChangeQuantity?.(line.id, quantity - step)
  }

  return (
    <div
      className={cn(
        "flex h-20 animate-in items-center gap-4 border-t border-dashed border-brand/30 px-6 duration-200 fade-in-0 slide-in-from-top-1",
        TICKET_NAME_INDENT,
        isConfirming && "bg-destructive/5",
        className
      )}
    >
      {isConfirming ? (
        <RemoveLineConfirm
          productName={product.name}
          onCancel={() => setIsConfirming(false)}
          onConfirm={() => onRemove?.(line.id)}
        />
      ) : (
        <>
          {/* Mismo orden que las columnas de la fila: acción bajo el nombre, cantidad a la derecha. */}
          <Button
            variant="destructive"
            size="xl"
            onClick={() => setIsConfirming(true)}
          >
            <Trash2 aria-hidden />
            Eliminar
          </Button>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Cantidad</span>
            <QuantityStepper
              value={formatQuantity(quantity, product.unit)}
              onDecrease={decrease}
              onIncrease={() => onChangeQuantity?.(line.id, quantity + step)}
            />
          </div>
        </>
      )}
    </div>
  )
}
