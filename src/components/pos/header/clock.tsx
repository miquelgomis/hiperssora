"use client"

import { useNow } from "@/hooks/use-now"
import { formatDate, formatTime } from "@/lib/format"
import { cn } from "@/lib/utils"

export type ClockProps = {
  /** Fecha fija a mostrar. Si se omite, muestra la hora actual y se actualiza sola. */
  date?: Date
  className?: string
}

/** Hora y fecha actuales de la caja. */
export function Clock({ date, className }: ClockProps) {
  const now = useNow()
  const value = date ?? now

  return (
    <time
      dateTime={value?.toISOString()}
      className={cn("flex flex-col items-end leading-tight", className)}
    >
      <span className="text-2xl font-semibold tabular-nums">
        {value ? formatTime(value) : "--:--"}
      </span>
      <span className="text-xs text-muted-foreground first-letter:uppercase">
        {value ? formatDate(value) : " "}
      </span>
    </time>
  )
}
