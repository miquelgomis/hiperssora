import type { ReactNode } from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SIZES = {
  md: "min-w-32 text-2xl",
  lg: "min-w-20 text-5xl tracking-tight",
}

export type QuantityStepperProps = {
  /** Cantidad ya formateada: «6 ud», «1,250 kg», «3». */
  value: ReactNode
  onDecrease?: () => void
  onIncrease?: () => void
  decreaseDisabled?: boolean
  increaseDisabled?: boolean
  /** `md`: en la línea del ticket. `lg`: protagonista de un modal. */
  size?: keyof typeof SIZES
  /** Nombre accesible de la cantidad. */
  label?: string
  className?: string
}

/** − cantidad +: botones de 56 px a los lados de la cantidad, que se anuncia al cambiar. */
export function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  decreaseDisabled,
  increaseDisabled,
  size = "md",
  label = "Cantidad",
  className,
}: QuantityStepperProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button
        variant="outline"
        size="icon-xl"
        aria-label="Restar"
        disabled={decreaseDisabled}
        onClick={onDecrease}
        className="bg-background"
      >
        <Minus />
      </Button>
      <output
        aria-live="polite"
        aria-label={label}
        className={cn("text-center font-semibold tabular-nums", SIZES[size])}
      >
        {value}
      </output>
      <Button
        variant="outline"
        size="icon-xl"
        aria-label="Sumar"
        disabled={increaseDisabled}
        onClick={onIncrease}
        className="bg-background"
      >
        <Plus />
      </Button>
    </div>
  )
}
