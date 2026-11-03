import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { IconTile, type IconTone } from "./icon-tile"

export type EmptyStateProps = {
  icon: LucideIcon
  tone?: IconTone
  /** Clases del icono (p. ej., `animate-spin` mientras se carga). */
  iconClassName?: string
  title: ReactNode
  description?: ReactNode
  className?: string
}

/**
 * Estado sin contenido que mostrar: vacío, cargando, sin resultados o error. Icono en una
 * baldosa, título y, si hace falta, qué hacer. Ocupa todo el alto disponible, centrado.
 */
export function EmptyState({
  icon,
  tone = "neutral",
  iconClassName,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col items-center justify-center gap-3 text-center",
        className
      )}
    >
      <IconTile icon={icon} tone={tone} iconClassName={iconClassName} />
      <p className="text-lg font-medium">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
