"use client"

import { Trash2 } from "lucide-react"

import { ConfirmDialog, SummaryRow } from "@/components/common"
import { formatItemCount, formatPrice } from "@/lib/format"

export type ClearTicketDialogProps = {
  open: boolean
  total: number
  itemCount: number
  onOpenChange?: (open: boolean) => void
  /** "Sí, anular compra": se vacía el ticket para empezar de cero. */
  onConfirm?: () => void
}

/** Confirmación antes de anular (tirar) la compra en curso. No se puede deshacer. */
export function ClearTicketDialog({
  open,
  total,
  itemCount,
  onOpenChange,
  onConfirm,
}: ClearTicketDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      icon={Trash2}
      tone="destructive"
      title="¿Anular esta compra?"
      description="Se eliminarán todos los productos del ticket para empezar de cero. Esta acción no se puede deshacer."
      confirmLabel="Sí, anular compra"
      confirmIcon={Trash2}
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
