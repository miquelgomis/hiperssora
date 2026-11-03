"use client"

import { Pause, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { shortcuts } from "@/config/shortcuts"
import { cn } from "@/lib/utils"

export type TicketActionsProps = {
  /** Abre la confirmación de *Pausar compra*. */
  onPause?: () => void
  /** Abre la confirmación de *Anular compra*. */
  onClear?: () => void
  /** Ticket vacío: no hay nada que pausar ni anular. */
  disabled?: boolean
  className?: string
}

/**
 * Acciones secundarias sobre la compra entera, bajo *Cobrar*: **Pausar compra** (F4) y **Anular
 * compra**. Los dos tienen el mismo estilo (con borde, *Anular* en rojo), mucho más discreto
 * que *Cobrar*, y piden confirmación.
 */
export function TicketActions({
  onPause,
  onClear,
  disabled,
  className,
}: TicketActionsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <Button
        variant="outline"
        size="xl"
        disabled={disabled}
        onClick={onPause}
        className="short:h-12"
      >
        <Pause aria-hidden />
        <span className="flex-1 text-left">Pausar compra</span>
        <Kbd>{shortcuts.pauseTicket.key}</Kbd>
      </Button>
      <Button
        variant="outline"
        size="xl"
        disabled={disabled}
        onClick={onClear}
        className="text-destructive hover:bg-destructive-soft hover:text-destructive short:h-12"
      >
        <Trash2 aria-hidden />
        <span className="flex-1 text-left">Anular compra</span>
      </Button>
    </div>
  )
}
