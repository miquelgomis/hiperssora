import { AgeBadge, HighlightMatch } from "@/components/common"
import type { Product } from "@/types/pos"

export type ProductLabelProps = {
  product: Product
  /** Lo buscado: se resalta en el nombre y en el EAN. */
  query?: string
}

/**
 * Nombre del producto con el código EAN debajo, en gris: así se identifica un producto en todo
 * el TPV (ticket y buscador). Los +18 llevan su distintivo; los nombres largos se cortan.
 */
export function ProductLabel({ product, query = "" }: ProductLabelProps) {
  return (
    <span className="flex min-w-0 flex-col">
      <span className="flex min-w-0 items-center gap-2">
        <span className="min-w-0 truncate text-base font-medium">
          <HighlightMatch text={product.name} query={query} />
        </span>
        {product.ageRestricted && <AgeBadge />}
      </span>
      <span className="font-mono text-sm text-muted-foreground">
        <HighlightMatch text={product.ean} query={query} />
      </span>
    </span>
  )
}
