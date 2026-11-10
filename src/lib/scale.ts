/**
 * Báscula simulada de la maqueta. Devuelve un peso aleatorio entre 0,500 y 1,500 kg,
 * redondeado al gramo. Cuando haya báscula real, solo cambia esta función.
 */
export function readScaleWeight(): number {
  const grams = 500 + Math.random() * 1000
  return Math.round(grams) / 1000
}

/** Aviso de maqueta que acompaña a la báscula en pantalla. */
export const SCALE_MOCKUP_NOTE =
  "báscula simulada con un peso aleatorio entre 0,5 y 1,5 kg"

/** Lo que tarda la báscula simulada en estabilizar el peso. */
export const SCALE_DELAY_MS = 1200
