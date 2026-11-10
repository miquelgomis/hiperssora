"use client"

import { useControllableState } from "@/components/hooks"
import type { CheckoutStep } from "@/types/pos"

import { CardPaymentDialog } from "./card-payment-dialog"
import { CashPaymentDialog } from "./cash-payment-dialog"
import { PaymentCompleteDialog } from "./payment-complete-dialog"
import { PaymentMethodDialog } from "./payment-method-dialog"

const START: CheckoutStep = { name: "method" }

export type CheckoutFlowProps = {
  /** Cobro en curso (se ha pulsado *Cobrar*). */
  open: boolean
  total: number
  /**
   * Paso actual (control externo). Quien conecta el datáfono lo controla para pasar de
   * `card` a `complete` cuando el pago se aprueba.
   */
  step?: CheckoutStep
  onStepChange?: (step: CheckoutStep) => void
  /** Paso inicial sin control externo (útil para documentar). */
  defaultStep?: CheckoutStep
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
 * Es solo interfaz: no habla con el datáfono. En el paso `card` espera a que quien lo controla
 * (`step`) lo pase a `complete`.
 */
export function CheckoutFlow({
  open,
  total,
  step: stepProp,
  onStepChange,
  defaultStep = START,
  onCancel,
  onComplete,
}: CheckoutFlowProps) {
  const [step, setStep] = useControllableState(
    stepProp,
    onStepChange,
    defaultStep
  )

  function cancel() {
    setStep(START)
    onCancel?.()
  }

  function finish() {
    setStep(START)
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
        onOpenChange={(next) => !next && setStep(START)}
        onBack={() => setStep(START)}
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
        onCancel={() => setStep(START)}
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
