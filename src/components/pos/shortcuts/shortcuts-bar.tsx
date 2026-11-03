import { HintBar, ShortcutHint } from "@/components/common"
import { emptyTicketShortcutList, shortcutList } from "@/config/shortcuts"

export type ShortcutsBarProps = {
  /**
   * `ticket` (por defecto): todos los atajos. `empty`: solo los útiles con el ticket vacío
   * (buscar, bolsa, secciones, multiplicar y salir).
   */
  variant?: "ticket" | "empty"
  className?: string
}

/**
 * Barra inferior con la leyenda de atajos de teclado: tecla + acción. Solo muestra lo que se
 * puede hacer en ese momento: con el ticket vacío, sin las teclas que actúan sobre productos.
 */
export function ShortcutsBar({
  variant = "ticket",
  className,
}: ShortcutsBarProps) {
  const shortcuts = variant === "empty" ? emptyTicketShortcutList : shortcutList

  return (
    <HintBar className={className}>
      {shortcuts.map(({ key, label }) => (
        <ShortcutHint
          key={key}
          keyLabel={key}
          label={label}
          className="animate-in duration-300 fade-in-0"
        />
      ))}
    </HintBar>
  )
}
