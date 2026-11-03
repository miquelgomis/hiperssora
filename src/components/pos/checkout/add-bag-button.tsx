"use client"

import { ShoppingBag } from "lucide-react"

import { CountBadge } from "@/components/common"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { shortcuts } from "@/config/shortcuts"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"

export type AddBagButtonProps = {
  /** Precio de la bolsa, que se muestra en el botón. */
  price: number
  /** Bolsas que ya lleva la compra. Con más de 0, se muestra un contador. */
  count?: number
  onClick?: () => void
  className?: string
}

/**
 * Botón *Bolsa* (F3): añade una bolsa al carrito; si ya hay, suma 1 a su cantidad. Un contador
 * muestra cuántas lleva ya la compra, para no dudar de si se añadió. Es un botón secundario,
 * más discreto que los de sección (Frutería, Verdulería, Panadería).
 */
export function AddBagButton({
  price,
  count = 0,
  onClick,
  className,
}: AddBagButtonProps) {
  return (
    <Button
      variant="outline"
      size="xl"
      onClick={onClick}
      className={cn("w-full short:h-12", className)}
    >
      <ShoppingBag aria-hidden />
      <span className="flex-1 text-left">
        Bolsa
        <span className="ml-1.5 text-sm text-muted-foreground tabular-nums">
          {formatPrice(price)}
        </span>
      </span>
      {count > 0 && (
        <CountBadge
          count={count}
          aria-label={`${count} ${count === 1 ? "bolsa" : "bolsas"} en el carrito`}
        />
      )}
      <Kbd>{shortcuts.addBag.key}</Kbd>
    </Button>
  )
}
