import type { NumpadKey } from "@/components/pos/checkout"
import type { Section } from "@/config/sections"
import { getShortcutAction } from "@/config/shortcuts"
import type { TicketLine } from "@/types/pos"

import { useKeyboardShortcuts } from "./use-keyboard-shortcuts"

export type PosKeyboardActions = {
  lines: TicketLine[]
  selectedLineId?: string
  selectLine: (lineId: string) => void
  /** Teclado numérico (`useQuantityEntry`). */
  numpad: {
    press: (key: NumpadKey) => void
    reset: () => void
    isDirty: boolean
  }
  /** La línea seleccionada está pidiendo confirmación para eliminarse. */
  isConfirmingRemoval: boolean
  setConfirmingRemoval: (confirming: boolean) => void
  removeSelectedLine: () => void
  /** Sumar (+1) o restar (−1) un paso a la cantidad de la línea seleccionada. */
  stepSelectedQuantity: (direction: 1 | -1) => void
  openSearch: () => void
  charge: () => void
  addBag: () => void
  pauseTicket: () => void
  openSection: (sectionId: Section["id"]) => void
  dismissNotice: () => void
}

/**
 * Teclado físico de la pantalla principal del TPV. Las teclas de acción salen de
 * `@/config/shortcuts`; además, los dígitos, la coma, Retroceso y Enter manejan el teclado
 * numérico. Con un modal abierto, mandan las teclas del modal.
 */
export function usePosKeyboard(actions: PosKeyboardActions, enabled = true) {
  useKeyboardShortcuts({
    enabled,
    onKey: (event) => handleKey(event, actions),
  })
}

/** Devuelve `true` si la tecla tenía una acción en este momento. */
function handleKey(event: KeyboardEvent, actions: PosKeyboardActions): boolean {
  const { lines, selectedLineId, numpad } = actions
  const hasLines = lines.length > 0
  const key = event.key

  // Teclado numérico.
  if (/^\d$/.test(key)) return press(numpad, key as NumpadKey)
  if (key === "," || key === ".") return press(numpad, ",")
  if (key === "Backspace") return press(numpad, "backspace")
  if (key === "Enter") {
    if (actions.isConfirmingRemoval) return run(actions.removeSelectedLine)
    // Sin nada tecleado, Enter conserva su función normal (p. ej., pulsar el botón enfocado).
    return numpad.isDirty && press(numpad, "quantity")
  }

  switch (getShortcutAction(key)) {
    case "previousLine":
    case "nextLine": {
      if (!hasLines) return false
      const index = lines.findIndex((line) => line.id === selectedLineId)
      const step = getShortcutAction(key) === "previousLine" ? -1 : 1
      const next = Math.min(Math.max(index + step, 0), lines.length - 1)
      actions.setConfirmingRemoval(false)
      actions.selectLine(lines[next].id)
      return true
    }
    case "increase":
    case "decrease":
      return (
        Boolean(selectedLineId) &&
        run(() =>
          actions.stepSelectedQuantity(
            getShortcutAction(key) === "increase" ? 1 : -1
          )
        )
      )
    case "removeLine":
      return (
        Boolean(selectedLineId) && run(() => actions.setConfirmingRemoval(true))
      )
    case "multiply":
      return press(numpad, "multiply")
    case "charge":
      return hasLines && run(actions.charge)
    case "search":
      return run(actions.openSearch)
    case "addBag":
      return run(actions.addBag)
    case "pauseTicket":
      return hasLines && run(actions.pauseTicket)
    case "fruteria":
    case "verduleria":
    case "panaderia":
      return run(() =>
        actions.openSection(getShortcutAction(key) as Section["id"])
      )
    case "exit":
      // Esc cancela lo que esté en marcha, de lo más concreto a lo más general.
      if (actions.isConfirmingRemoval)
        return run(() => actions.setConfirmingRemoval(false))
      if (numpad.isDirty) return run(numpad.reset)
      return run(actions.dismissNotice)
    default:
      return false
  }
}

function press(numpad: PosKeyboardActions["numpad"], key: NumpadKey) {
  numpad.press(key)
  return true
}

function run(action: () => void) {
  action()
  return true
}
