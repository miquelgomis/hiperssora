import { useEffect, useState } from "react"

import { CARD_APPROVAL_DELAY_MS } from "@/lib/payment-terminal"
import type { CheckoutStep } from "@/types/pos"

/**
 * Paso del flujo de cobro (`CheckoutFlow`) conectado al datáfono. En la maqueta, el datáfono
 * simulado aprueba el pago con tarjeta pasado `CARD_APPROVAL_DELAY_MS`.
 */
export function useCheckout() {
  const [step, setStep] = useState<CheckoutStep>({ name: "method" })

  useEffect(() => {
    if (step.name !== "card") return
    const timer = setTimeout(
      () => setStep({ name: "complete", method: "card", change: 0 }),
      CARD_APPROVAL_DELAY_MS
    )
    return () => clearTimeout(timer)
  }, [step.name])

  return { step, setStep }
}
