import { useState, useSyncExternalStore } from "react"

type Updater<T> = T | ((previous: T) => T)

// Avisa a todos los hooks montados cuando cambia algo en localStorage, en esta pestaña
// (`notify`) o en otra (evento `storage`).
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener("storage", listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

// localStorage puede no existir (servidor) o fallar (modo privado, cuota llena).
function readItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeItem(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Sin almacenamiento, el estado sigue funcionando en memoria hasta recargar.
  }
}

// Cache por cadena: useSyncExternalStore necesita el mismo objeto mientras no cambie el JSON.
const parsed = new Map<string, unknown>()

function parse<T>(raw: string, revive: (value: unknown) => T): T | null {
  if (!parsed.has(raw)) {
    try {
      parsed.set(raw, revive(JSON.parse(raw)))
    } catch {
      parsed.set(raw, null) // Datos corruptos: se ignoran y se usa el valor inicial.
    }
  }
  return parsed.get(raw) as T | null
}

const identity = <T>(value: unknown) => value as T

/**
 * Como `useState`, pero guardado en `localStorage` bajo `key`: sobrevive a recargas y se
 * sincroniza entre pestañas. Con `key` nulo se comporta como un `useState` normal (stories).
 *
 * - En el servidor y en la hidratación se usa `initialValue`; justo después, lo guardado.
 * - `revive` reconstruye lo que JSON no conserva (p. ej., fechas). Debe ser estable
 *   (definida fuera del componente).
 */
export function usePersistentState<T>(
  key: string | null,
  initialValue: T,
  revive: (value: unknown) => T = identity
) {
  const [memoryValue, setMemoryValue] = useState(initialValue)
  const raw = useSyncExternalStore(
    subscribe,
    () => (key ? readItem(key) : null),
    () => null
  )

  const storedValue = raw === null ? null : parse(raw, revive)
  const value = key ? (storedValue ?? initialValue) : memoryValue

  function setValue(updater: Updater<T>) {
    if (!key) return setMemoryValue(updater)

    // Se parte siempre de lo último guardado, para encadenar varias actualizaciones seguidas.
    const latestRaw = readItem(key)
    const previous =
      (latestRaw === null ? null : parse(latestRaw, revive)) ?? initialValue
    const next =
      typeof updater === "function"
        ? (updater as (previous: T) => T)(previous)
        : updater
    writeItem(key, next)
    notify()
  }

  return [value, setValue] as const
}
