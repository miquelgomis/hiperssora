import type { ComponentProps, ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { Kbd } from "@/components/ui/kbd"
import { cn } from "@/lib/utils"

const SIZES = {
  md: {
    card: "h-20 gap-1",
    icon: "size-8 short:size-7",
    label: "text-base font-medium",
  },
  lg: { card: "h-44 gap-3", icon: "size-12", label: "text-xl font-semibold" },
}

export type OptionCardProps = ComponentProps<"button"> & {
  /** Icono en rojo, sobre el nombre. */
  icon?: LucideIcon
  /** Nombre de la opción. Sin él, el contenido lo pone `children`. */
  label?: ReactNode
  /** Línea de ayuda bajo el nombre. */
  description?: ReactNode
  /** Tecla que la elige, en la esquina (F5…). */
  shortcutKey?: string
  /** `md` (80 px): secciones. `lg` (176 px): formas de pago. */
  size?: keyof typeof SIZES
}

/**
 * Tarjeta táctil para elegir una opción: fondo blanco con borde que, al pasar el dedo o con el
 * foco, se tiñe del color de la marca. Con `icon` y `label` tiene su disposición de siempre
 * (secciones, formas de pago); con `children`, el contenido lo pone cada uso (compra en pausa,
 * producto del catálogo).
 */
export function OptionCard({
  icon: Icon,
  label,
  description,
  shortcutKey,
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: OptionCardProps) {
  const sizes = SIZES[size]

  return (
    <button
      type={type}
      className={cn(
        "rounded-xl border bg-background transition-colors outline-none hover:border-brand hover:bg-brand-soft focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px",
        label !== undefined &&
          cn("relative flex flex-col items-center justify-center", sizes.card),
        className
      )}
      {...props}
    >
      {label !== undefined ? (
        <>
          {shortcutKey && (
            <Kbd className="absolute top-2 right-2">{shortcutKey}</Kbd>
          )}
          {Icon && (
            <Icon
              className={cn("stroke-[1.5] text-brand", sizes.icon)}
              aria-hidden
            />
          )}
          <span className={sizes.label}>{label}</span>
          {description && (
            <span className="text-sm text-muted-foreground">{description}</span>
          )}
        </>
      ) : (
        children
      )}
    </button>
  )
}
