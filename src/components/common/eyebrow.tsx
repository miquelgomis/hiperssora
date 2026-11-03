import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type EyebrowProps = {
  children: ReactNode
  className?: string
}

/**
 * Rótulo: 12 px en MAYÚSCULAS (por CSS), sobre un dato o al frente de una columna. Es el único
 * texto en mayúsculas del TPV.
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "text-xs font-medium tracking-wide text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </span>
  )
}
