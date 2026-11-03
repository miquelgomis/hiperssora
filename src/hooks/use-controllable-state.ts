import { useState } from "react"

/**
 * Estado que un componente gestiona solo, pero que su padre puede controlar pasando `value`
 * (y `onChange`). Permite, por ejemplo, abrir un modal desde un atajo de teclado.
 */
export function useControllableState<T>(
  value: T | undefined,
  onChange: ((value: T) => void) | undefined,
  defaultValue: T
) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = value !== undefined

  function setValue(next: T) {
    if (!isControlled) setInternalValue(next)
    onChange?.(next)
  }

  return [isControlled ? value : internalValue, setValue] as const
}
