import { useState } from "react"

import type { NumpadKey, NumpadProps } from "@/components/pos/checkout"
import { formatQuantityValue } from "@/lib/format"
import type { TicketLine } from "@/types/pos"

/** Dígitos máximos que se pueden teclear. */
const MAX_LENGTH = 6

const toNumber = (value: string) => Number(value.replace(",", "."))

/**
 * Teclado numérico (en pantalla o físico) del panel de cobro.
 *
 * - El visor muestra la cantidad de la línea seleccionada; al teclear se escribe un número
 *   nuevo y *Cantidad* (o Enter) lo aplica a esa línea. Cambiar de línea lo descarta.
 * - `×` (o `*`) convierte lo tecleado en multiplicador: el siguiente producto que entre lo
 *   usará como cantidad (`takeMultiplier`).
 */
export function useQuantityEntry(
  line: TicketLine | undefined,
  apply: (lineId: string, quantity: number) => void
) {
  // Lo tecleado pertenece a la línea seleccionada en ese momento (o a ninguna).
  const [draft, setDraft] = useState<{
    lineId: string | null
    value: string
  } | null>(null)
  const [multiplier, setMultiplier] = useState<number | null>(null)

  const lineId = line?.id ?? null
  const value = draft?.lineId === lineId ? draft.value : null
  // Sin línea, o multiplicando, se admiten decimales (el siguiente producto puede ir al peso).
  const allowDecimal = !line || line.product.unit === "kg"

  function setValue(next: string | null) {
    setDraft(next ? { lineId, value: next } : null)
  }

  function press(key: NumpadKey) {
    const current = value ?? ""

    if (/^\d$/.test(key)) {
      if (current.length < MAX_LENGTH)
        setValue(current === "0" ? key : current + key)
    } else if (key === ",") {
      if (allowDecimal && !current.includes(","))
        setValue((current || "0") + ",")
    } else if (key === "backspace") {
      setValue(current.slice(0, -1))
    } else if (key === "clear") {
      reset()
    } else if (key === "multiply" && value && toNumber(value) > 0) {
      setMultiplier(toNumber(value))
      setValue(null)
    } else if (key === "quantity" && value && line) {
      if (toNumber(value) > 0) apply(line.id, toNumber(value))
      setValue(null)
    }
  }

  /** Descarta lo tecleado, pero no el multiplicador (p. ej., tras una lectura de la pistola). */
  function discardDraft() {
    setDraft(null)
  }

  /** Descarta lo tecleado y el multiplicador. */
  function reset() {
    setDraft(null)
    setMultiplier(null)
  }

  /** Devuelve el multiplicador pendiente (o `null`) y lo consume. */
  function takeMultiplier(): number | null {
    setMultiplier(null)
    return multiplier
  }

  const numpad: Omit<NumpadProps, "className"> = {
    value:
      multiplier !== null && value === null
        ? formatQuantityValue(multiplier, "unit").replace(".", ",")
        : (value ??
          (line ? formatQuantityValue(line.quantity, line.product.unit) : "")),
    productName: line?.product.name,
    unitLabel: line ? (line.product.unit === "kg" ? "kg" : "ud") : undefined,
    isEditing: value !== null,
    isMultiplying: multiplier !== null && value === null,
    allowDecimal,
    canApplyQuantity: line !== undefined,
    onKeyPress: press,
  }

  return {
    numpad,
    press,
    reset,
    discardDraft,
    takeMultiplier,
    /** Hay algo tecleado o un multiplicador pendiente. */
    isDirty: value !== null || multiplier !== null,
  }
}
