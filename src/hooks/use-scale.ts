import { useEffect, useState } from "react"

import { readScaleWeight, SCALE_DELAY_MS } from "@/lib/scale"
import type { Product } from "@/types/pos"

type Reading = { productId: string; attempt: number; weight: number }

/**
 * Pesa el producto en la báscula (simulada). `weight` es `null` mientras pesa y el peso en kg
 * cuando se estabiliza. Cada producto nuevo se vuelve a pesar, y `reweigh` repite la lectura.
 */
export function useScale(product: Product | null) {
  const [attempt, setAttempt] = useState(0)
  const [reading, setReading] = useState<Reading | null>(null)

  useEffect(() => {
    if (!product) return
    const timer = setTimeout(
      () =>
        setReading({
          productId: product.id,
          attempt,
          weight: readScaleWeight(),
        }),
      SCALE_DELAY_MS
    )
    return () => clearTimeout(timer)
  }, [product, attempt])

  const isCurrent =
    product !== null &&
    reading?.productId === product.id &&
    reading.attempt === attempt

  return {
    weight: isCurrent ? reading.weight : null,
    reweigh: () => setAttempt((current) => current + 1),
  }
}
