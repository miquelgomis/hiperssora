"use client"

import { Button } from "@/components/ui/button"
import { Modal, SummaryRow } from "@/components/common"
import { formatPrice } from "@/lib/format"

import { QuickAmounts } from "./quick-amounts"

export type CashPaymentDialogProps = {
  open: boolean
  total: number
  /** Importe entregado por el cliente. */
  amountTendered: number
  onOpenChange?: (open: boolean) => void
  onAmountTenderedChange?: (amount: number) => void
  onBack?: () => void
  onConfirm?: () => void
}

/** Cobro en efectivo: importe entregado, botones rápidos de billetes y cambio a devolver. */
export function CashPaymentDialog({
  open,
  total,
  amountTendered,
  onOpenChange,
  onAmountTenderedChange,
  onBack,
  onConfirm,
}: CashPaymentDialogProps) {
  const change = amountTendered - total
  const isEnough = change >= 0

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      align="start"
      title="Pago en efectivo"
      description="Introduce el importe entregado por el cliente"
      footer={
        <>
          <Button variant="outline" size="xl" onClick={onBack}>
            Volver
          </Button>
          <Button size="xl" disabled={!isEnough} onClick={onConfirm}>
            Confirmar cobro
          </Button>
        </>
      }
    >
      <div className="grid gap-3">
        <SummaryRow
          label="Total a cobrar"
          value={formatPrice(total)}
          size="md"
        />
        <SummaryRow
          label="Entregado"
          value={formatPrice(amountTendered)}
          variant="outline"
        />
      </div>

      <QuickAmounts total={total} onSelect={onAmountTenderedChange} />

      <SummaryRow
        label={isEnough ? "Cambio" : "Falta"}
        value={formatPrice(Math.abs(change))}
        variant={isEnough ? "brand" : "muted"}
        size="xl"
      />
    </Modal>
  )
}
