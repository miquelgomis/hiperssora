import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const VARIANTS = {
  /** Sin caja: «Importe … 2,46 €». */
  plain: "",
  /** Caja gris: resumen de la compra. */
  muted: "rounded-xl bg-muted/50 px-5 py-4",
  /** Caja con borde: un dato que se está introduciendo («Entregado»). */
  outline: "rounded-xl border px-5 py-4",
  /** Caja de la marca, con el dato en rojo: lo que hay que devolver («Cambio»). */
  brand: "rounded-xl bg-brand-soft px-5 py-4",
}

const SIZES = {
  md: "text-base",
  lg: "text-2xl",
  xl: "text-3xl",
}

export type SummaryRowProps = {
  /** Dato secundario, a la izquierda: «3 artículos», «Importe». */
  label: ReactNode
  /** Dato principal, a la derecha: «12,40 €». */
  value: ReactNode
  variant?: keyof typeof VARIANTS
  /** Tamaño del dato: `md` (16 px), `lg` (24 px) o `xl` (30 px). */
  size?: keyof typeof SIZES
  className?: string
}

/**
 * Fila «rótulo … dato»: el dato secundario en gris a la izquierda y el principal, en
 * seminegrita, a la derecha. Resúmenes, importes, cambio a devolver.
 */
export function SummaryRow({
  label,
  value,
  variant = "plain",
  size = "lg",
  className,
}: SummaryRowProps) {
  return (
    <dl
      className={cn(
        "flex items-center justify-between gap-4",
        VARIANTS[variant],
        className
      )}
    >
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "font-semibold tabular-nums",
          SIZES[size],
          variant === "brand" && "text-brand"
        )}
      >
        {value}
      </dd>
    </dl>
  )
}
