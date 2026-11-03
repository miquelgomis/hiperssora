"use client"

import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Modal, SummaryRow } from "@/components/common"
import { formatPrice } from "@/lib/format"
import type { PaymentMethod } from "@/types/pos"

const METHOD_LABEL: Record<PaymentMethod, string> = {
  card: "Pagado con tarjeta",
  cash: "Pagado en efectivo",
}

export type PaymentCompleteDialogProps = {
  open: boolean
  total: number
  method: PaymentMethod
  /** Cambio a devolver (solo en efectivo). */
  change?: number
  /** "Nueva venta": cierra el cobro y deja la caja vacía para el siguiente cliente. */
  onNewSale?: () => void
}

/** Último paso del cobro: confirmación del pago y, en efectivo, el cambio a devolver. */
export function PaymentCompleteDialog({
  open,
  total,
  method,
  change = 0,
  onNewSale,
}: PaymentCompleteDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={(next) => !next && onNewSale?.()}
      icon={CheckCircle2}
      tone="success"
      title="Cobro completado"
      description={`${METHOD_LABEL[method]} · Entrega el ticket al cliente`}
      figure={formatPrice(total)}
      footer={
        <Button autoFocus size="xl" className="w-full" onClick={onNewSale}>
          Nueva venta
        </Button>
      }
    >
      {method === "cash" && change > 0 && (
        <SummaryRow
          label="Cambio a devolver"
          value={formatPrice(change)}
          variant="brand"
          size="xl"
        />
      )}
    </Modal>
  )
}
