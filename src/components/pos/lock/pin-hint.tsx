import { Keyboard } from "lucide-react"

import { cn } from "@/lib/utils"

export type PinHintProps = {
  /** El último PIN era incorrecto. */
  hasError?: boolean
}

/**
 * Mensaje bajo los puntos del PIN: cómo introducirlo (en el teclado físico de la caja) o, si
 * era incorrecto, el aviso en rojo. Siempre ocupa su línea, así nada salta al cambiar.
 */
export function PinHint({ hasError = false }: PinHintProps) {
  return (
    <p
      role="alert"
      className={cn(
        "h-5 text-sm font-medium",
        hasError ? "text-destructive" : "text-muted-foreground"
      )}
    >
      {hasError ? (
        "PIN incorrecto. Inténtalo de nuevo."
      ) : (
        <span className="flex items-center gap-2">
          <Keyboard className="size-4" aria-hidden />
          Teclea tu PIN en el teclado de la caja
        </span>
      )}
    </p>
  )
}
