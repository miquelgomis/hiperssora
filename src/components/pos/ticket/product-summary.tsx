import { ProductThumbnail } from "@/components/common"
import type { Product } from "@/types/pos"

import { ProductLabel } from "./product-label"

export type ProductSummaryProps = {
  product: Product
}

/**
 * Producto sobre el que actúa un modal (p. ej., la verificación de edad): foto, nombre con el EAN
 * debajo y, si es +18, su distintivo, sobre una caja gris.
 */
export function ProductSummary({ product }: ProductSummaryProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-muted/50 px-4 py-3">
      <ProductThumbnail src={product.imageUrl} alt={product.name} />
      <ProductLabel product={product} />
    </div>
  )
}
