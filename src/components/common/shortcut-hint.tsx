import type { ReactNode } from "react"

import { Kbd } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"

export type ShortcutHintProps = {
  /** Tecla: «F2», «↑↓», «Esc». */
  keyLabel: string
  /** Qué hace: «Buscar». */
  label: ReactNode
  className?: string
}

/** Pista de teclado: la tecla, como una tecla de verdad, y lo que hace. */
export function ShortcutHint({
  keyLabel,
  label,
  className,
}: ShortcutHintProps) {
  return (
    <li
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground",
        className
      )}
    >
      <Kbd className="h-6 min-w-6 border bg-background px-1.5 text-foreground shadow-xs">
        {keyLabel}
      </Kbd>
      {label}
    </li>
  )
}

export type HintBarProps = {
  /** Las pistas (`ShortcutHint`). */
  children: ReactNode
  /** A la derecha: un contador, un estado… */
  end?: ReactNode
  className?: string
}

/** Franja gris de 48 px con pistas de teclado, al pie de la pantalla o de un modal. */
export function HintBar({ children, end, className }: HintBarProps) {
  return (
    <footer
      className={cn(
        "flex h-12 min-w-0 shrink-0 items-center justify-between gap-6 overflow-hidden border-t bg-muted/40 px-6 text-sm text-muted-foreground",
        className
      )}
    >
      <ul
        aria-label="Atajos de teclado"
        className="flex min-w-0 items-center gap-5 overflow-hidden whitespace-nowrap"
      >
        {children}
      </ul>
      {end}
    </footer>
  )
}
