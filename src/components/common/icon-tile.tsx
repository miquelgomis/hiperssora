import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** Color de la baldosa: marca, peligro (borrar, error), éxito o neutro. */
export type IconTone = "brand" | "destructive" | "success" | "neutral"

const TONES: Record<IconTone, string> = {
  brand: "bg-brand-soft text-brand",
  destructive: "bg-destructive-soft text-destructive",
  success: "bg-success-soft text-success",
  neutral: "bg-muted text-muted-foreground",
}

const SIZES = {
  md: { tile: "size-14", icon: "size-7" },
  lg: { tile: "size-16", icon: "size-8" },
}

export type IconTileProps = {
  icon: LucideIcon
  tone?: IconTone
  /** `md` (56 px): cabeceras. `lg` (64 px): modales y estados vacíos. */
  size?: keyof typeof SIZES
  /** Clases del icono (p. ej., `animate-spin` mientras se carga). */
  iconClassName?: string
  className?: string
}

/** Icono en una baldosa de color con las esquinas redondeadas. */
export function IconTile({
  icon: Icon,
  tone = "brand",
  size = "lg",
  iconClassName,
  className,
}: IconTileProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl",
        SIZES[size].tile,
        TONES[tone],
        className
      )}
    >
      <Icon
        className={cn(SIZES[size].icon, "stroke-[1.5]", iconClassName)}
        aria-hidden
      />
    </span>
  )
}
