import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { shortcuts } from "@/config/shortcuts"
import { cn } from "@/lib/utils"

export type ChargeButtonProps = {
  /** Sin productos no hay nada que cobrar. */
  disabled?: boolean
  onCharge?: () => void
  className?: string
}

/**
 * **Cobrar**: la acción principal del TPV. El botón más alto del panel (64 px), en el rojo de la
 * marca y con su tecla (F1). Abre el flujo de pago.
 */
export function ChargeButton({
  disabled,
  onCharge,
  className,
}: ChargeButtonProps) {
  return (
    <Button
      size="2xl"
      className={cn("h-16 w-full shrink-0 rounded-xl short:h-14", className)}
      disabled={disabled}
      onClick={onCharge}
    >
      <span className="flex-1 text-left">Cobrar</span>
      <Kbd className="bg-white/20 text-primary-foreground">
        {shortcuts.charge.key}
      </Kbd>
    </Button>
  )
}
