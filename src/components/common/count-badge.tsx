import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type CountBadgeProps = Omit<ComponentProps<typeof Badge>, "children"> & {
  count: number
}

/**
 * Contador redondo junto a un botón: compras en pausa, bolsas… En rojo con algo que contar y
 * en gris con cero.
 */
export function CountBadge({ count, className, ...props }: CountBadgeProps) {
  return (
    <Badge
      variant={count > 0 ? "default" : "secondary"}
      className={cn("h-6 min-w-6 rounded-full px-1.5 tabular-nums", className)}
      {...props}
    >
      {count}
    </Badge>
  )
}
