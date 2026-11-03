import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/strings"
import type { Cashier } from "@/types/pos"

export type CashierIdentityProps = {
  cashier: Cashier
}

/** Quién está en la caja: avatar con sus iniciales, nombre y, debajo en gris, el número de caja. */
export function CashierIdentity({ cashier }: CashierIdentityProps) {
  return (
    <span className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback>{getInitials(cashier.name)}</AvatarFallback>
      </Avatar>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-sm font-medium">{cashier.name}</span>
        <span className="text-xs text-muted-foreground">
          Caja {cashier.register}
        </span>
      </span>
    </span>
  )
}
