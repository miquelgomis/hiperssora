"use client"

import { Pause } from "lucide-react"

import { ConfirmDialog, SummaryRow } from "@/components/common"
import { formatItemCount, formatPrice } from "@/lib/format"

export type PauseTicketDialogProps = {
  open: boolean
  total: number
  itemCount: number
  onOpenChange?: (open: boolean) => void
  /** "Sí, pausar": la compra pasa a *Clientes en pausa* y la caja queda libre. */
  onConfirm?: () => void
}

/** Confirmación antes de pausar la compra en curso. */
export function PauseTicketDialog({
  open,
  total,
  itemCount,
  onOpenChange,
  onConfirm,
}: PauseTicketDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      icon={Pause}
      title="¿Pausar la compra?"
      description={
        <>
          Quedará en <strong>Clientes en pausa</strong> para recuperarla cuando
          el cliente vuelva, y la caja quedará libre.
        </>
      }
      confirmLabel="Sí, pausar"
      confirmIcon={Pause}
      onConfirm={onConfirm}
    >
      <SummaryRow
        variant="muted"
        label={formatItemCount(itemCount)}
        value={formatPrice(total)}
      />
    </ConfirmDialog>
  )
}
