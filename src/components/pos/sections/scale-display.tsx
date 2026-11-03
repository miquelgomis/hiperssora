import type { Ref } from "react"
import { Loader2, RotateCw, Scale } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatQuantity } from "@/lib/format"
import { cn } from "@/lib/utils"

export type ScaleDisplayProps = {
  /** Peso leído en kg. `null` mientras la báscula pesa. */
  weight: number | null
  /** "Volver a pesar": repite la lectura. */
  onReweigh?: () => void
  /** Para enfocar el visor mientras pesa (así un Enter impaciente no hace nada). */
  ref?: Ref<HTMLDivElement>
}

/**
 * Visor de la báscula: *Pesando…* con el borde discontinuo y, cuando el peso se estabiliza, el
 * peso en grande sobre el color de la marca. Al lado, **Volver a pesar**.
 */
export function ScaleDisplay({ weight, onReweigh, ref }: ScaleDisplayProps) {
  const isWeighing = weight === null

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={cn(
        "flex items-center justify-between gap-4 rounded-2xl border-2 py-6 pr-5 pl-7 transition-colors outline-none",
        isWeighing ? "border-dashed" : "border-brand bg-brand-soft"
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          {isWeighing ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Scale className="size-4" aria-hidden />
          )}
          {isWeighing ? "Pesando…" : "Peso en báscula"}
        </span>
        <output
          aria-live="polite"
          className={cn(
            "text-5xl font-semibold tracking-tight tabular-nums",
            isWeighing && "animate-pulse text-muted-foreground/40"
          )}
        >
          {formatQuantity(weight ?? 0, "kg")}
        </output>
      </div>
      <Button
        variant="outline"
        size="xl"
        disabled={isWeighing}
        onClick={onReweigh}
        className="bg-background"
      >
        <RotateCw aria-hidden />
        Volver a pesar
      </Button>
    </div>
  )
}
