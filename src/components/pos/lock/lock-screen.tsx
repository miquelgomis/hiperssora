"use client"

import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { KeyRound } from "lucide-react"

import { Logo, MockupNote } from "@/components/common"
import { DEMO_PIN, PIN_LENGTH } from "@/config/auth"
import { cn } from "@/lib/utils"
import type { Cashier } from "@/types/pos"

import { Clock } from "../header"
import { CashierGreeting } from "./cashier-greeting"
import { PinHint } from "./pin-hint"
import { PinIndicator } from "./pin-indicator"

export type LockScreenVariant = "welcome" | "locked"

/** Duración de la salida al desbloquear: `delay-300` + `duration-200`. */
const UNLOCK_EXIT_MS = 500

/** `idle`: esperando el PIN. `unlocking`: PIN correcto, animación de salida en curso. */
type Phase = "idle" | "unlocking"

export type LockScreenProps = {
  cashier: Cashier
  /**
   * `welcome`: primera entrada del turno ("Hola, Miquel").
   * `locked`: el cajero ha pulsado *Bloquear pantalla*.
   */
  variant?: LockScreenVariant
  /** Se llama con el PIN correcto, cuando termina la animación de salida. */
  onUnlock?: () => void
  /** Fecha fija para el reloj (stories). */
  date?: Date
  className?: string
}

/**
 * Pantalla de bloqueo del TPV. Cubre toda la pantalla y pide el PIN del cajero, que se teclea
 * con el **teclado físico** de la caja (no hay teclado en pantalla).
 *
 * Al completar los 4 dígitos se valida. Si es correcto, los puntos se ponen en verde y la
 * pantalla sale como un modal (fundido de 200 ms, contenido al 95 %); al terminar se llama a
 * `onUnlock`. Si no, marca
 * el error y vacía el PIN.
 */
export function LockScreen({
  cashier,
  variant = "welcome",
  onUnlock,
  date,
  className,
}: LockScreenProps) {
  const [pin, setPinState] = useState("")
  // Copia síncrona del PIN: las teclas pueden llegar más rápido que los renders.
  const pinRef = useRef("")
  function setPin(next: string) {
    pinRef.current = next
    setPinState(next)
  }
  const [hasError, setHasError] = useState(false)
  const [phase, setPhase] = useState<Phase>("idle")
  const isUnlocking = phase === "unlocking"

  function typeDigit(digit: string) {
    const next = pinRef.current + digit
    setHasError(false)
    setPin(next)
    if (next.length < PIN_LENGTH) return

    if (next === DEMO_PIN) {
      setPhase("unlocking")
    } else {
      setPin("")
      setHasError(true)
    }
  }

  // Teclado físico: dígitos (fila superior y teclado numérico), Retroceso y Escape.
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (isUnlocking) return
    if (/^\d$/.test(event.key)) typeDigit(event.key)
    else if (event.key === "Backspace") setPin(pinRef.current.slice(0, -1))
    else if (event.key === "Escape") setPin("")
  })

  // En layout effect: escucha desde el primer instante, sin perder la primera tecla.
  useLayoutEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // Al acertar, se avisa cuando termina la salida (300 ms de espera + 200 ms de fundido). Va
  // por temporizador y no por `animationend`, que no llega si las animaciones están desactivadas.
  const finishUnlock = useEffectEvent(() => onUnlock?.())
  useEffect(() => {
    if (!isUnlocking) return
    const timeout = setTimeout(finishUnlock, UNLOCK_EXIT_MS)
    return () => clearTimeout(timeout)
  }, [isUnlocking])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lock-screen-title"
      className={cn(
        "fixed inset-0 z-50 flex min-w-7xl flex-col bg-background",
        // Mismas transiciones que los modales: fundido corto.
        "animate-in duration-200 fade-in-0",
        isUnlocking &&
          "pointer-events-none animate-out delay-300 duration-200 fade-out-0 fill-mode-forwards",
        className
      )}
    >
      <header className="flex h-20 shrink-0 items-center justify-between px-6">
        <Logo />
        <Clock date={date} />
      </header>

      {/* El contenido se acerca al entrar y se aleja al salir (95 %), como los modales. */}
      <main
        className={cn(
          "flex flex-1 animate-in flex-col items-center justify-center gap-10 pb-20 duration-200 zoom-in-95",
          isUnlocking &&
            "animate-out delay-300 duration-200 fill-mode-forwards zoom-out-95"
        )}
      >
        <CashierGreeting
          cashier={cashier}
          variant={variant}
          titleId="lock-screen-title"
        />

        <div className="flex flex-col items-center gap-4">
          <PinIndicator
            filled={pin.length}
            length={PIN_LENGTH}
            error={hasError}
            success={isUnlocking}
          />
          <PinHint hasError={hasError} />
        </div>

        <MockupNote icon={KeyRound}>
          el PIN es{" "}
          <strong className="font-mono text-foreground">{DEMO_PIN}</strong>
        </MockupNote>
      </main>
    </div>
  )
}
