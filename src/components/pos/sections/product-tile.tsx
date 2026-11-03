"use client"

import { OptionCard, ProductThumbnail } from "@/components/common"
import { formatUnitPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/pos"

export type ProductTileProps = {
  product: Product
  onSelect?: (product: Product) => void
  className?: string
}

/** Producto del catálogo de una sección: foto grande, nombre y precio por kilo. Toda la tarjeta es táctil. */
export function ProductTile({
  product,
  onSelect,
  className,
}: ProductTileProps) {
  return (
    <OptionCard
      onClick={() => onSelect?.(product)}
      className={cn(
        "flex min-h-56 flex-col items-center gap-3 rounded-2xl p-4 text-center",
        className
      )}
    >
      <ProductThumbnail src={product.imageUrl} alt={product.name} size="xl" />
      <span className="line-clamp-2 text-base leading-snug font-medium">
        {product.name}
      </span>
      <span className="mt-auto text-sm text-muted-foreground tabular-nums">
        {formatUnitPrice(product.price, product.unit)}
      </span>
    </OptionCard>
  )
}
