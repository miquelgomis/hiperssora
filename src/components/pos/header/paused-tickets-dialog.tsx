"use client"

import { ArrowLeftRight, PauseCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CountBadge,
  InfoNote,
  Modal,
  ModalClose,
  ModalTrigger,
} from "@/components/common"
import { formatItemCount, formatPrice } from "@/lib/format"
import type { PausedTicket, TicketSummary } from "@/types/pos"

import { PausedTicketItem } from "./paused-ticket-item"

export type PausedTicketsDialogProps = {
  tickets: PausedTicket[]
  /**
   * Se llama al elegir una compra para recuperarla en la caja. Si hay una compra en curso,
   * quien lo recibe debe pausarla antes (intercambio).
   */
  onRestore?: (ticketId: string) => void
  /**
   * Compra en curso, si la hay. Entonces cada compra de la lista se ofrece como
   * *Pausar actual y recuperar*: un toque pausa la actual y recupera la elegida.
   */
  currentTicket?: TicketSummary | null
  /** Abre el modal de inicio (útil para documentar). */
  defaultOpen?: boolean
}

/**
 * Botón "Clientes en pausa" de la cabecera. El contador indica las compras aparcadas; con
 * cero, el botón está desactivado. Al pulsarlo se abre un modal con la lista para restaurar una. Con una compra en curso,
 * recuperar otra la pausa automáticamente (intercambio en un toque).
 */
export function PausedTicketsDialog({
  tickets,
  onRestore,
  currentTicket,
  defaultOpen,
}: PausedTicketsDialogProps) {
  return (
    <Modal
      defaultOpen={defaultOpen}
      size="lg"
      align="start"
      showCloseButton
      title="Clientes en pausa"
      description="Elige la compra que quieres recuperar en la caja"
      trigger={
        <ModalTrigger
          disabled={tickets.length === 0}
          render={<Button variant="outline" size="xl" />}
        >
          <PauseCircle aria-hidden />
          Clientes en pausa
          <CountBadge count={tickets.length} />
        </ModalTrigger>
      }
    >
      <ul className="grid gap-2">
        {currentTicket && (
          <li>
            <InfoNote icon={ArrowLeftRight}>
              <strong className="font-semibold">
                Compra en curso: {formatItemCount(currentTicket.itemCount)} ·{" "}
                {formatPrice(currentTicket.total)}.
              </strong>{" "}
              Se pausará al recuperar otra.
            </InfoNote>
          </li>
        )}
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <ModalClose
              onClick={() => onRestore?.(ticket.id)}
              render={
                <PausedTicketItem
                  ticket={ticket}
                  swaps={Boolean(currentTicket)}
                />
              }
            />
          </li>
        ))}
      </ul>
    </Modal>
  )
}
