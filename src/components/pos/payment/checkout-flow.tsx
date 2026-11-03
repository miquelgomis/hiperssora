"use client"

import { useEffect, useState } from "react"

import { CARD_APPROVAL_DELAY_MS } from "@/lib/payment-terminal"
import type { PaymentMethod } from "@/types/pos"

import { CardPaymentDialog } from "./card-payment-dialog"
import { CashPaymentDialog } from "./cash-payment-dialog"
import { PaymentCompleteDialog } from "./payment-complete-dialog"
import { PaymentMethodDialog } from "./payment-method-dialog"

type Step =
  | { name: "method" }
  | { name: "cash"; tendered: number }
  | { name: "card" }
  | { name: "complete"; method: PaymentMethod; change: number }

export type CheckoutFlowProps = {
  /** Cobro en curso (se ha pulsado *Cobrar*). */
  open: boolean
  total: number
  /** Se sale del cobro sin cobrar (Cancelar o Esc en la forma de pago). */
  onCancel?: () => void
  /** "Nueva venta" tras cobrar: hay que vaciar la caja. */
  onComplete?: () => void
}

/**
 * Flujo de cobro: forma de pago → efectivo o tarjeta → cobro completado.
 * Cada paso sustituye al anterior (nunca hay dos modales a la vez) y *Volver* o *Cancelar*
 * regresan al paso previo.
 *
 * Maqueta: el datáfono siempre aprueba tras 2,5 s (`src/lib/payment-terminal.ts`).
 */
export function CheckoutFlow({
  open,
  total,
  onCancel,
  onComplete,
}: CheckoutFlowProps) {
  const [step, setStep] = useState<Step>({ name: "method" })

  // Datáfono simulado: aprueba el pago con tarjeta pasado un tiempo.
  useEffect(() => {
    if (step.name !== "card") return
    const timer = setTimeout(
      () => setStep({ name: "complete", method: "card", change: 0 }),
      CARD_APPROVAL_DELAY_MS
    )
    return () => clearTimeout(timer)
  }, [step.name])

  function cancel() {
    setStep({ name: "method" })
    onCancel?.()
  }

  function finish() {
    setStep({ name: "method" })
    onComplete?.()
  }

  return (
    <>
      <PaymentMethodDialog
        open={open && step.name === "method"}
        total={total}
        onOpenChange={(next) => !next && cancel()}
        onSelect={(method) =>
          setStep(
            method === "cash" ? { name: "cash", tendered: 0 } : { name: "card" }
          )
        }
      />
      <CashPaymentDialog
        open={open && step.name === "cash"}
        total={total}
        amountTendered={step.name === "cash" ? step.tendered : 0}
        onAmountTenderedChange={(tendered) =>
          setStep({ name: "cash", tendered })
        }
        onOpenChange={(next) => !next && setStep({ name: "method" })}
        onBack={() => setStep({ name: "method" })}
        onConfirm={() =>
          step.name === "cash" &&
          setStep({
            name: "complete",
            method: "cash",
            change: step.tendered - total,
          })
        }
      />
      <CardPaymentDialog
        open={open && step.name === "card"}
        total={total}
        status="waiting"
        onCancel={() => setStep({ name: "method" })}
      />
      <PaymentCompleteDialog
        open={open && step.name === "complete"}
        total={total}
        method={step.name === "complete" ? step.method : "card"}
        change={step.name === "complete" ? step.change : 0}
        onNewSale={finish}
      />
    </>
  )
}
