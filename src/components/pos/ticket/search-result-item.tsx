"use client"

import { useEffect, useRef } from "react"

import { ProductThumbnail } from "@/components/common"
import { formatUnitPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/pos"

import { ProductLabel } from "./product-label"

export type SearchResultItemProps = {
  product: Product
  /** Texto buscado: se resalta en el nombre y en el EAN. */
  query: string
  /** Resultado activo (↑/↓). Enter lo añade. */
  active?: boolean
  onSelect?: (product: Product) => void
  /** Al pasar el ratón o el dedo, pasa a ser el activo. */
  onActivate?: () => void
}

/**
 * Resultado del buscador: foto, nombre con el EAN debajo y precio. El resultado activo
 * (↑/↓) se desplaza solo hasta quedar a la vista.
 */
export function SearchResultItem({
  product,
  query,
  active,
  onSelect,
  onActivate,
}: SearchResultItemProps) {
  const ref = useRef<HTMLLIElement>(null)

  // Al moverse con ↑/↓, el resultado activo siempre queda a la vista.
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" })
  }, [active])

  return (
    <li
      ref={ref}
      role="option"
      aria-selected={active}
      onClick={() => onSelect?.(product)}
      onPointerEnter={onActivate}
      className={cn(
        // Igual que una línea del ticket: de borde a borde, con una línea debajo.
        "grid h-18 cursor-pointer grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-4 border-b px-6 transition-colors",
        active && "bg-brand-soft shadow-[inset_4px_0_0_var(--brand)]"
      )}
    >
      <ProductThumbnail src={product.imageUrl} alt={product.name} />
      <ProductLabel product={product} query={query} />
      <span className="text-base text-muted-foreground tabular-nums">
        {formatUnitPrice(product.price, product.unit)}
      </span>
    </li>
  )
}
