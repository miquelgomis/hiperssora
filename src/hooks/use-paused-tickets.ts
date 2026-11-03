import { usePersistentState } from "@/hooks/use-persistent-state"
import type { PausedTicket, TicketLine } from "@/types/pos"

type PausedState = {
  tickets: PausedTicket[]
  /** Número del siguiente ticket pausado (0001, 0002…). */
  nextNumber: number
}

// JSON guarda las fechas como texto: se vuelven a convertir en Date al leer.
function revive(value: unknown): PausedState {
  const state = value as PausedState
  return {
    ...state,
    tickets: state.tickets.map((ticket) => ({
      ...ticket,
      pausedAt: new Date(ticket.pausedAt),
    })),
  }
}

/** Añade la compra a la lista con el siguiente número de ticket. */
function withPaused(state: PausedState, lines: TicketLine[]): PausedState {
  const ticket: PausedTicket = {
    id: crypto.randomUUID(),
    number: String(state.nextNumber).padStart(4, "0"),
    pausedAt: new Date(),
    lines,
  }
  return {
    tickets: [...state.tickets, ticket],
    nextNumber: state.nextNumber + 1,
  }
}

/**
 * Compras en pausa: se aparcan con un número de ticket y se recuperan cuando vuelve el
 * cliente. Con `storageKey`, se guardan en localStorage y sobreviven a recargas.
 */
export function usePausedTickets(
  initialTickets: PausedTicket[] = [],
  storageKey: string | null = null
) {
  const [state, setState] = usePersistentState<PausedState>(
    storageKey,
    { tickets: initialTickets, nextNumber: initialTickets.length + 1 },
    revive
  )

  function pause(lines: TicketLine[]) {
    setState((current) => withPaused(current, lines))
  }

  /**
   * Recupera una compra: la saca de la lista y devuelve sus líneas. Si se pasan las líneas
   * de la compra en curso, se pausan a la vez (intercambio).
   */
  function take(ticketId: string, currentLines: TicketLine[] = []) {
    const restored = state.tickets.find((ticket) => ticket.id === ticketId)
    setState((current) => {
      const remaining = {
        ...current,
        tickets: current.tickets.filter((ticket) => ticket.id !== ticketId),
      }
      return currentLines.length > 0
        ? withPaused(remaining, currentLines)
        : remaining
    })
    return restored?.lines ?? []
  }

  return { tickets: state.tickets, pause, take }
}
