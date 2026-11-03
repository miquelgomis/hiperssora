import { Button } from "@/components/ui/button"
import { moveGridFocus } from "@/lib/grid-navigation"

/** Billetes que se ofrecen como botones rápidos de importe entregado. */
const QUICK_AMOUNTS = [5, 10, 20, 50]

export type QuickAmountsProps = {
  total: number
  /** Importe elegido: el total (*Exacto*) o un billete. */
  onSelect?: (amount: number) => void
}

/**
 * Botones rápidos de importe entregado: *Exacto* y los billetes de 5, 10, 20 y 50 €. Las
 * flechas los recorren.
 */
export function QuickAmounts({ total, onSelect }: QuickAmountsProps) {
  return (
    <div
      className="grid grid-cols-5 gap-2"
      onKeyDown={(event) => {
        if (moveGridFocus(event.currentTarget, event.key) !== "ignored")
          event.preventDefault()
      }}
    >
      <Button variant="secondary" size="xl" onClick={() => onSelect?.(total)}>
        Exacto
      </Button>
      {QUICK_AMOUNTS.map((amount) => (
        <Button
          key={amount}
          variant="outline"
          size="xl"
          className="tabular-nums"
          onClick={() => onSelect?.(amount)}
        >
          {amount} €
        </Button>
      ))}
    </div>
  )
}
