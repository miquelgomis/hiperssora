import { useEffect, useEffectEvent } from "react"

/** Una pistola lectora teclea cada dígito en pocos ms; una persona tarda mucho más. */
const MAX_KEY_INTERVAL_MS = 50
const EAN_PATTERN = /^\d{8,14}$/

type Options = {
  /** Se llama con el código leído (8 a 14 dígitos). */
  onScan: (ean: string) => void
  /** Desactiva la escucha (p. ej., con la pantalla bloqueada). */
  enabled?: boolean
}

/**
 * Detecta lecturas de una pistola de códigos de barras, que funciona como un teclado: teclea
 * los dígitos muy rápido y termina con Enter. Ignora lo que se teclea en campos de texto o
 * dentro de un modal: ahí la lectura llega al campo como texto normal.
 */
export function useBarcodeScanner({ onScan, enabled = true }: Options) {
  const handleScan = useEffectEvent(onScan)

  useEffect(() => {
    if (!enabled) return
    let buffer = ""
    let lastKeyAt = 0

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (target.closest("input, textarea, [role='dialog']")) return

      const now = event.timeStamp
      if (now - lastKeyAt > MAX_KEY_INTERVAL_MS) buffer = ""
      lastKeyAt = now

      if (/^\d$/.test(event.key)) {
        buffer += event.key
        return
      }
      if (event.key === "Enter" && EAN_PATTERN.test(buffer)) {
        event.preventDefault()
        handleScan(buffer)
      }
      // Cualquier otra tecla corta la lectura (p. ej., el `*` de «6 *» antes de escanear).
      buffer = ""
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [enabled])
}
