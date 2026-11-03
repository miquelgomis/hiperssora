import { Eyebrow } from "@/components/common"
import { formatItemCount, formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export type TicketTotalProps = {
  total: number
  itemCount: number
  className?: string
}

/** Importe total del ticket en curso, siempre visible en lo alto del panel de cobro. */
export function TicketTotal({ total, itemCount, className }: TicketTotalProps) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="flex flex-col">
        <Eyebrow>Total</Eyebrow>
        <span className="text-sm text-muted-foreground tabular-nums">
          {formatItemCount(itemCount)}
        </span>
      </div>
      <output className="text-5xl font-semibold tracking-tight tabular-nums short:text-4xl">
        {formatPrice(total)}
      </output>
    </div>
  )
}
