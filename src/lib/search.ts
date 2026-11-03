import type { Product } from "@/types/pos"

import { normalize } from "./strings"

/**
 * Busca productos por nombre o por una parte del EAN.
 * "plat" encuentra "Plátano de Canarias"; "8410" encuentra todos los EAN que lo contienen.
 */
export function searchProducts(
  products: Product[],
  query: string,
  limit = 6
): Product[] {
  const term = normalize(query.trim())
  if (!term) return []

  return products
    .filter(
      (product) =>
        normalize(product.name).includes(term) || product.ean.includes(term)
    )
    .slice(0, limit)
}
