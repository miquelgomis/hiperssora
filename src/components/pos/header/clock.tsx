import { formatDate, formatTime } from "@/lib/format"
import { cn } from "@/lib/utils"

export type ClockProps = {
  /**
   * Fecha y hora a mostrar. Sin valor (p. ej., en el servidor, antes de saber la hora) se ve
   * `--:--`. En la app la pone `PosApp`, que la actualiza cada minuto (`useNow`).
   */
  date?: Date | null
  className?: string
}

/** Hora y fecha de la caja. */
export function Clock({ date, className }: ClockProps) {
  return (
    <time
      dateTime={date?.toISOString()}
      className={cn("flex flex-col items-end leading-tight", className)}
    >
      <span className="text-2xl font-semibold tabular-nums">
        {date ? formatTime(date) : "--:--"}
      </span>
      <span className="text-xs text-muted-foreground first-letter:uppercase">
        {date ? formatDate(date) : " "}
      </span>
    </time>
  )
}
