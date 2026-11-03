const OFFSETS: Record<string, "left" | "right" | "up" | "down"> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
}

export type GridMove = "moved" | "edge-top" | "ignored"

/**
 * Mueve el foco entre los botones de una rejilla con las flechas. Las columnas se calculan a
 * partir de la posición real de los elementos, así que funciona con rejillas adaptables.
 * Devuelve `edge-top` si se pulsa ↑ en la primera fila (p. ej., para volver al buscador).
 */
export function moveGridFocus(container: HTMLElement, key: string): GridMove {
  const direction = OFFSETS[key]
  if (!direction) return "ignored"

  const items = [...container.querySelectorAll<HTMLElement>("button")]
  const index = items.indexOf(document.activeElement as HTMLElement)
  if (index === -1) return "ignored"

  const columns = items.filter(
    (item) => item.offsetTop === items[0].offsetTop
  ).length
  const step = { left: -1, right: 1, up: -columns, down: columns }[direction]
  const next = index + step

  if (direction === "up" && next < 0) return "edge-top"
  items[Math.min(Math.max(next, 0), items.length - 1)]?.focus()
  return "moved"
}
