"use client"

import { CreditCard, XCircle, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Modal, type ModalTone } from "@/components/common"
import { formatPrice } from "@/lib/format"

export type CardPaymentStatus = "waiting" | "declined"

const STATUS: Record<
  CardPaymentStatus,
  {
    title: string
    description: string
    icon: LucideIcon
    tone: ModalTone
    iconClassName?: string
  }
> = {
  waiting: {
    title: "Esperando al datáfono",
    description: "El cliente puede acercar, insertar o deslizar la tarjeta",
    icon: CreditCard,
    tone: "brand",
    iconClassName: "animate-pulse",
  },
  declined: {
    title: "Pago rechazado",
    description: "Prueba con otra tarjeta o cobra en efectivo",
    icon: XCircle,
    tone: "destructive",
  },
}

export type CardPaymentDialogProps = {
  open: boolean
  total: number
  status: CardPaymentStatus
  onOpenChange?: (open: boolean) => void
  onCancel?: () => void
  onRetry?: () => void
}

/**
 * Cobro con tarjeta: estado del datáfono, esperando la tarjeta o pago rechazado. Si se
 * aprueba, el flujo pasa a `PaymentCompleteDialog`.
 */
export function CardPaymentDialog({
  open,
  total,
  status,
  onOpenChange,
  onCancel,
  onRetry,
}: CardPaymentDialogProps) {
  const { title, description, icon, tone, iconClassName } = STATUS[status]

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      icon={icon}
      tone={tone}
      iconClassName={iconClassName}
      title={title}
      description={description}
      figure={formatPrice(total)}
      footer={
        status === "waiting" ? (
          <Button variant="outline" size="xl" onClick={onCancel}>
            Cancelar
          </Button>
        ) : (
          <>
            <Button variant="outline" size="xl" onClick={onCancel}>
              Cambiar forma de pago
            </Button>
            <Button size="xl" onClick={onRetry}>
              Reintentar
            </Button>
          </>
        )
      }
    />
  )
}
