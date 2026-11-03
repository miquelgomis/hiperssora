import { Trash2, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

export type RemoveLineConfirmProps = {
  /** Nombre del producto que se va a quitar. */
  productName: string
  onCancel?: () => void
  onConfirm?: () => void
}

/**
 * Confirmación **en la propia franja** de la línea, sin modal: *¿Eliminar «…» del ticket?* con
 * *Cancelar* y *Sí, eliminar*. Va dentro de `TicketLineEditor`.
 */
export function RemoveLineConfirm({
  productName,
  onCancel,
  onConfirm,
}: RemoveLineConfirmProps) {
  return (
    <>
      <TriangleAlert className="size-6 shrink-0 text-destructive" aria-hidden />
      <p role="alert" className="flex-1 text-base">
        ¿Eliminar <strong className="font-semibold">{productName}</strong> del
        ticket?
      </p>
      <Button variant="outline" size="xl" onClick={onCancel}>
        Cancelar
      </Button>
      <Button variant="danger" size="xl" onClick={onConfirm}>
        <Trash2 aria-hidden />
        Sí, eliminar
      </Button>
    </>
  )
}
