import { cn } from "@/lib/utils"

export type NumpadDisplayProps = {
  /** Lo que muestra: la cantidad de la línea seleccionada o lo tecleado. */
  value?: string
  /** Unidad tras la cifra (`kg`), en productos al peso. */
  unitLabel?: string
  /** Producto seleccionado, bajo «Cantidad». */
  productName?: string
  /** Hay un número tecleado por aplicar: se resalta y lo indica. */
  isEditing?: boolean
  /** Multiplicador pendiente (`6` `*`): «Siguiente producto ×». */
  isMultiplying?: boolean
  /** Tecla que aplica lo tecleado, para la pista: «Cantidad» o «Enter». */
  applyKey?: string
  className?: string
}

/**
 * Visor del teclado numérico. Muestra la cantidad de la línea seleccionada (`6`, `1,250 kg`),
 * nunca un 0 sin sentido. Al teclear se resalta en rojo con *Pulsa Cantidad para aplicar*; con
 * un multiplicador pendiente, *Siguiente producto ×*.
 */
export function NumpadDisplay({
  value = "",
  unitLabel,
  productName,
  isEditing = false,
  isMultiplying = false,
  applyKey = "Cantidad",
  className,
}: NumpadDisplayProps) {
  return (
    <div
      className={cn(
        "flex h-14 items-center justify-between gap-4 rounded-xl border bg-background px-4 transition-colors short:h-11",
        (isEditing || isMultiplying) && "border-brand bg-brand-soft",
        className
      )}
    >
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="text-sm text-muted-foreground">
          {isMultiplying ? "Siguiente producto ×" : "Cantidad"}
        </span>
        {!isMultiplying && (
          <span
            className={cn(
              "truncate text-xs",
              isEditing ? "font-medium text-brand" : "text-muted-foreground"
            )}
          >
            {isEditing ? `Pulsa ${applyKey} para aplicar` : productName}
          </span>
        )}
      </span>
      <output
        aria-live="polite"
        aria-label="Visor del teclado"
        className={cn(
          "shrink-0 text-3xl font-semibold tabular-nums",
          !value && "text-muted-foreground/40",
          isEditing && "text-brand"
        )}
      >
        {value || "0"}
        {unitLabel && !isMultiplying && (
          <span className="ml-1.5 text-lg font-medium text-muted-foreground">
            {unitLabel}
          </span>
        )}
        {isMultiplying && <span className="ml-1 text-brand">×</span>}
      </output>
    </div>
  )
}
