import type { Cashier } from "@/types/pos"

/**
 * PIN de desbloqueo de la maqueta. Es el mismo para todos los cajeros y se muestra en
 * pantalla a propósito. Cuando haya backend, la validación se hará en el servidor.
 */
export const DEMO_PIN = "1111"

export const PIN_LENGTH = DEMO_PIN.length

/** Cajero de la maqueta. Cuando haya inicio de sesión, vendrá de él. */
export const cashier: Cashier = { name: "Miquel Gomis", register: 3 }
