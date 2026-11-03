"use client"

import { Banknote, CreditCard, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Modal, ModalClose, OptionCard } from "@/components/common"
import { Kbd } from "@/components/ui/kbd"
import { shortcuts } from "@/config/shortcuts"
import { formatPrice } from "@/lib/format"
import { moveGridFocus } from "@/lib/grid-navigation"
import type { PaymentMethod } from "@/types/pos"

const METHODS: {
  id: PaymentMethod
  label: string
  description: string
  icon: LucideIcon
}[] = [
  {
    id: "card",
    label: "Tarjeta",
    description: "Datáfono o móvil",
    icon: CreditCard,
  },
  {
    id: "cash",
    label: "Efectivo",
    description: "Calcula el cambio",
    icon: Banknote,
  },
]

export type PaymentMethodDialogProps = {
  open: boolean
  total: number
  onOpenChange?: (open: boolean) => void
  onSelect?: (method: PaymentMethod) => void
}

/**
 * Primer paso del cobro: muestra el total y pregunta si se paga con tarjeta o en efectivo.
 * Teclado: el foco empieza en *Tarjeta*; ← → cambian de opción y Enter la elige.
 */
export function PaymentMethodDialog({
  open,
  total,
  onOpenChange,
  onSelect,
}: PaymentMethodDialogProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="xl"
      title="Cobrar"
      description="Selecciona la forma de pago"
      figure={formatPrice(total)}
      footer={
        <ModalClose render={<Button variant="outline" size="xl" />}>
          Cancelar <Kbd>{shortcuts.exit.key}</Kbd>
        </ModalClose>
      }
    >
      {/* ← → (y ↑ ↓) cambian de forma de pago; Enter la elige. */}
      <div
        className="grid grid-cols-2 gap-4"
        onKeyDown={(event) => {
          if (moveGridFocus(event.currentTarget, event.key) !== "ignored")
            event.preventDefault()
        }}
      >
        {METHODS.map(({ id, label, description, icon }) => (
          <OptionCard
            key={id}
            size="lg"
            icon={icon}
            label={label}
            description={description}
            onClick={() => onSelect?.(id)}
          />
        ))}
      </div>
    </Modal>
  )
}
