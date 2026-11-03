import { usePersistentState } from "@/hooks/use-persistent-state"
import {
  addToTicket,
  removeLine as removeTicketLine,
  setLineQuantity,
} from "@/lib/ticket"
import type { Product, TicketLine } from "@/types/pos"

type TicketState = {
  lines: TicketLine[]
  /** Línea seleccionada: la desplegada para editar. */
  selectedLineId?: string
  /** Ya se ha confirmado que el cliente es mayor de 18 años. */
  isAgeVerified: boolean
}

const hasAgeRestricted = (lines: TicketLine[]) =>
  lines.some((line) => line.product.ageRestricted)

/** Estado al cargar unas líneas: se selecciona la última y, si hay +18, ya se verificó. */
const fromLines = (lines: TicketLine[]): TicketState => ({
  lines,
  selectedLineId: lines.at(-1)?.id,
  isAgeVerified: hasAgeRestricted(lines),
})

/**
 * Estado del ticket en curso: líneas, línea seleccionada y verificación de edad.
 * Con `storageKey`, se guarda en localStorage y sobrevive a recargas.
 */
export function useTicket(
  initialLines: TicketLine[] = [],
  storageKey: string | null = null
) {
  const [state, setState] = usePersistentState(
    storageKey,
    fromLines(initialLines)
  )

  /** Añade el producto y selecciona su línea. */
  function addProduct(product: Product, quantity = 1) {
    setState((current) => {
      const next = addToTicket(current.lines, product, quantity)
      return { ...current, lines: next.lines, selectedLineId: next.lineId }
    })
  }

  function changeQuantity(lineId: string, quantity: number) {
    setState((current) => ({
      ...current,
      lines: setLineQuantity(current.lines, lineId, quantity),
    }))
  }

  /** Elimina la línea y selecciona la última que quede. */
  function removeLine(lineId: string) {
    setState((current) => {
      const lines = removeTicketLine(current.lines, lineId)
      return { ...current, lines, selectedLineId: lines.at(-1)?.id }
    })
  }

  return {
    ...state,
    selectLine: (lineId: string) =>
      setState((current) => ({ ...current, selectedLineId: lineId })),
    addProduct,
    changeQuantity,
    removeLine,
    /** Sustituye todas las líneas (vaciar la caja o recuperar una compra en pausa). */
    replaceLines: (lines: TicketLine[]) => setState(fromLines(lines)),
    /** El cajero ha confirmado que el cliente es mayor de 18 años. */
    verifyAge: () =>
      setState((current) => ({ ...current, isAgeVerified: true })),
  }
}
