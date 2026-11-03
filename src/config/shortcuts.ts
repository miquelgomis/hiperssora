import type { KeyboardShortcut } from "@/types/pos"

/**
 * Atajos de teclado del TPV. Es la única fuente de verdad: la barra inferior, las pistas de
 * los botones y el manejador de teclado (`usePosKeyboard`) leen de aquí. Las etiquetas son
 * cortas para que la barra quepa en una línea a 1280 px.
 */
export const shortcuts = {
  exit: { key: "Esc", label: "Salir", eventKey: "Escape" },
  previousLine: { key: "↑", label: "Anterior", eventKey: "ArrowUp" },
  nextLine: { key: "↓", label: "Siguiente", eventKey: "ArrowDown" },
  increase: { key: "+", label: "Sumar", eventKey: "+" },
  decrease: { key: "−", label: "Restar", eventKey: "-" },
  removeLine: { key: "Supr", label: "Eliminar", eventKey: "Delete" },
  multiply: { key: "*", label: "Multiplicar", eventKey: "*" },
  charge: { key: "F1", label: "Cobrar", eventKey: "F1" },
  search: { key: "F2", label: "Buscar", eventKey: "F2" },
  addBag: { key: "F3", label: "Bolsa", eventKey: "F3" },
  pauseTicket: { key: "F4", label: "Pausar", eventKey: "F4" },
  fruteria: { key: "F5", label: "Frutería", eventKey: "F5" },
  verduleria: { key: "F6", label: "Verdulería", eventKey: "F6" },
  panaderia: { key: "F7", label: "Panadería", eventKey: "F7" },
} satisfies Record<string, KeyboardShortcut>

export type ShortcutAction = keyof typeof shortcuts

const { fruteria, verduleria, panaderia, ...actionShortcuts } = shortcuts

/**
 * Atajos que muestra la barra inferior. Las tres secciones se agrupan en una sola entrada
 * (cada botón de sección ya muestra su tecla), para que la barra quepa en una línea.
 */
const sectionsShortcut: KeyboardShortcut = {
  key: `${fruteria.key}–${panaderia.key}`,
  label: "Secciones",
  eventKey: `${fruteria.eventKey} ${verduleria.eventKey} ${panaderia.eventKey}`,
}

export const shortcutList: KeyboardShortcut[] = [
  ...Object.values(actionShortcuts),
  sectionsShortcut,
]

/**
 * Atajos útiles con el ticket vacío: los que añaden productos (y salir). Moverse entre líneas,
 * sumar, restar, eliminar, cobrar o pausar no tienen sentido sin productos.
 */
export const emptyTicketShortcutList: KeyboardShortcut[] = [
  shortcuts.exit,
  shortcuts.search,
  shortcuts.addBag,
  sectionsShortcut,
  shortcuts.multiply,
]

/** Acción asociada a una tecla (`KeyboardEvent.key`), si la hay. */
export function getShortcutAction(
  eventKey: string
): ShortcutAction | undefined {
  return (Object.keys(shortcuts) as ShortcutAction[]).find(
    (action) => shortcuts[action].eventKey === eventKey
  )
}
