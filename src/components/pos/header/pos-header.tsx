import { Logo } from "@/components/common"
import { Separator } from "@/components/ui/separator"
import type { ReactNode } from "react"

import type { Cashier, PausedTicket, TicketSummary } from "@/types/pos"

import { Clock } from "./clock"
import { PausedTicketsDialog } from "./paused-tickets-dialog"
import { UserDialog } from "./user-dialog"

export type PosHeaderProps = {
  cashier: Cashier
  pausedTickets: PausedTicket[]
  /** Fecha y hora del reloj. Sin valor, el reloj muestra `--:--`. */
  date?: Date | null
  /** Recuperar una compra en pausa. */
  onRestoreTicket?: (ticketId: string) => void
  /** Compra en curso: recuperar otra la pausa antes. */
  currentTicket?: TicketSummary | null
  /** "Bloquear pantalla" en el modal del cajero. */
  onLock?: () => void
  /** "Cerrar sesión" en el modal del cajero. */
  onLogout?: () => void
  /** Aviso en el hueco entre el logotipo y la hora (p. ej., `ScanNotice`). */
  notice?: ReactNode
}

/**
 * Barra superior del TPV: logotipo, avisos, hora, clientes en pausa y menú del cajero. Los
 * avisos salen centrados en el hueco libre entre el logotipo y la hora.
 */
export function PosHeader({
  cashier,
  pausedTickets,
  date,
  onRestoreTicket,
  currentTicket,
  onLock,
  onLogout,
  notice,
}: PosHeaderProps) {
  return (
    <header className="flex h-20 items-center gap-6 border-b px-6">
      <Logo />
      <div className="flex min-w-0 flex-1 justify-center">{notice}</div>
      <div className="flex items-center gap-4">
        <Clock date={date} />
        <Separator orientation="vertical" className="h-10" />
        <PausedTicketsDialog
          tickets={pausedTickets}
          onRestore={onRestoreTicket}
          currentTicket={currentTicket}
        />
        <UserDialog cashier={cashier} onLock={onLock} onLogout={onLogout} />
      </div>
    </header>
  )
}
