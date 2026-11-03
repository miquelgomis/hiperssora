import { useEffect, useEffectEvent } from "react"

type Options = {
  /** Recibe cada tecla; devuelve `true` si la ha gestionado (se cancela su acción por defecto). */
  onKey: (event: KeyboardEvent) => boolean | void
  enabled?: boolean
}

/**
 * Teclado físico de la pantalla principal. No actúa mientras se escribe en un campo ni con un
 * modal abierto: ahí mandan las teclas del propio modal (Esc, ↑/↓, Enter).
 */
export function useKeyboardShortcuts({ onKey, enabled = true }: Options) {
  const handleKey = useEffectEvent((event: KeyboardEvent) => {
    // Otro manejador (p. ej., la pistola lectora) ya la ha usado.
    if (event.defaultPrevented) return

    const target = event.target as HTMLElement
    const isTyping = target.closest("input, textarea, [contenteditable]")
    const hasOpenDialog = document.querySelector(
      "[role='dialog']:not([hidden])"
    )
    if (isTyping || hasOpenDialog) return

    if (onKey(event)) event.preventDefault()
  })

  useEffect(() => {
    if (!enabled) return
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [enabled])
}
