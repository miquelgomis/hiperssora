import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getFirstName, getInitials } from "@/lib/strings"
import type { Cashier } from "@/types/pos"

export type CashierGreetingProps = {
  cashier: Cashier
  /** `welcome`: *Hola, Miquel* (inicio de turno). `locked`: *Pantalla bloqueada*. */
  variant?: "welcome" | "locked"
  /** Id del título, para que la pantalla de bloqueo lo use como nombre accesible. */
  titleId?: string
}

/** Saludo de la pantalla de bloqueo: avatar grande del cajero, título, qué hacer y su caja. */
export function CashierGreeting({
  cashier,
  variant = "welcome",
  titleId,
}: CashierGreetingProps) {
  const isWelcome = variant === "welcome"

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Avatar className="mb-2 size-24 text-3xl">
        <AvatarFallback>{getInitials(cashier.name)}</AvatarFallback>
      </Avatar>
      <h1 id={titleId} className="text-4xl font-semibold tracking-tight">
        {isWelcome
          ? `Hola, ${getFirstName(cashier.name)}`
          : "Pantalla bloqueada"}
      </h1>
      <p className="text-lg text-muted-foreground">
        {isWelcome
          ? "Introduce tu PIN para empezar a trabajar"
          : `${cashier.name}, introduce tu PIN para continuar`}
      </p>
      <p className="text-sm text-muted-foreground">Caja {cashier.register}</p>
    </div>
  )
}
