import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type MockupNoteProps = {
  icon?: LucideIcon
  /** Lo que está simulado, en minúscula: sigue a «Maqueta:» («el PIN es 1111»). */
  children: ReactNode
  className?: string
}

/**
 * Aviso de **maqueta**: explica lo que está simulado (el PIN, la báscula…) para quien prueba la
 * interfaz. Desaparecerá cuando haya backend y dispositivos reales.
 */
export function MockupNote({
  icon: Icon,
  children,
  className,
}: MockupNoteProps) {
  return (
    <p
      className={cn(
        "flex w-fit items-center gap-2 self-center justify-self-center rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground",
        className
      )}
    >
      {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
      <span>
        <span className="font-medium">Maqueta:</span> {children}
      </span>
    </p>
  )
}
