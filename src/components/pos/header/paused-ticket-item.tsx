import type { ComponentProps } from "react"
import { ArrowLeftRight, RotateCcw } from "lucide-react"

import { OptionCard } from "@/components/common"
import { formatItemCount, formatPrice, formatTime } from "@/lib/format"
import { getItemCount, getTicketTotal } from "@/lib/ticket"
import { cn } from "@/lib/utils"
import type { PausedTicket } from "@/types/pos"

export type PausedTicketItemProps = Omit<
  ComponentProps<typeof OptionCard>,
  "children"
> & {
  ticket: PausedTicket
  /** Hay una compra en curso: recuperar esta la pausa (*Pausar actual y recuperar*). */
  swaps?: boolean
}

/**
 * Compra en pausa en la lista de *Clientes en pausa*: número de ticket, desde cuándo espera,
 * artículos e importe. Con una compra en curso, ofrece *Pausar actual y recuperar*.
 */
export function PausedTicketItem({
  ticket,
  swaps = false,
  className,
  ...props
}: PausedTicketItemProps) {
  return (
    <OptionCard
      className={cn(
        "flex h-20 w-full items-center gap-4 px-4 text-left",
        className
      )}
      {...props}
    >
      <span className="flex flex-1 flex-col">
        <span className="text-base font-medium">Ticket {ticket.number}</span>
        <span className="text-sm text-muted-foreground">
          En pausa desde las {formatTime(ticket.pausedAt)} ·{" "}
          {formatItemCount(getItemCount(ticket.lines))}
        </span>
      </span>
      <span className="text-base font-semibold tabular-nums">
        {formatPrice(getTicketTotal(ticket.lines))}
      </span>
      {swaps ? (
        <span className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-primary-foreground">
          <ArrowLeftRight className="size-4" aria-hidden />
          Pausar actual y recuperar
        </span>
      ) : (
        <RotateCcw className="size-5 text-brand" aria-hidden />
      )}
    </OptionCard>
  )
}
