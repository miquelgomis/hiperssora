import { useSyncExternalStore } from "react"

const MINUTE = 60_000

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000)
  return () => clearInterval(id)
}

// Se redondea al minuto para que el snapshot solo cambie cuando cambia la hora visible.
const getSnapshot = () => Math.floor(Date.now() / MINUTE)
const getServerSnapshot = () => null

/** Hora actual, actualizada cada minuto. Devuelve `null` en el servidor. */
export function useNow(): Date | null {
  const minutes = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  return minutes === null ? null : new Date(minutes * MINUTE)
}
