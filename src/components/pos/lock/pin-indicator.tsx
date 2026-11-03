import { cn } from "@/lib/utils"

export type PinIndicatorProps = {
  /** Dígitos introducidos hasta ahora. */
  filled: number
  /** Longitud total del PIN. */
  length: number
  /** PIN incorrecto: los puntos se marcan en rojo. */
  error?: boolean
  /** PIN correcto: los puntos se marcan en verde. */
  success?: boolean
  className?: string
}

/** Puntos que indican cuántos dígitos del PIN se han tecleado, sin mostrarlos. */
export function PinIndicator({
  filled,
  length,
  error,
  success,
  className,
}: PinIndicatorProps) {
  return (
    <div
      role="status"
      aria-label={`PIN: ${filled} de ${length} dígitos`}
      className={cn("flex items-center justify-center gap-4", className)}
    >
      {Array.from({ length }, (_, index) => (
        <span
          key={index}
          className={cn(
            "size-5 rounded-full border-2 border-foreground/30 transition-colors",
            index < filled && "border-foreground bg-foreground",
            error && "border-destructive bg-destructive",
            success && "border-success bg-success"
          )}
        />
      ))}
    </div>
  )
}
