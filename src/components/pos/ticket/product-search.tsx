"use client"

import { useState } from "react"

import { useControllableState } from "@/hooks/use-controllable-state"
import { useProductSearch } from "@/hooks/use-product-search"
import { fetchProducts, type ProductSearchFn } from "@/lib/product-api"
import type { Product } from "@/types/pos"

import { ProductSearchDialog } from "./product-search-dialog"
import { SearchTrigger } from "./search-trigger"

export type ProductSearchProps = {
  /** Función de búsqueda. Por defecto, el catálogo real de Nutriinfo (`/api/products`). */
  search?: ProductSearchFn
  /** Producto elegido. El modal se cierra y el buscador se vacía. */
  onSelect?: (product: Product) => void
  /** Abre el modal de inicio (útil para documentar). */
  defaultOpen?: boolean
  /** Control externo del modal (p. ej., abrirlo con F2). */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

/**
 * Buscador de productos del ticket: `SearchTrigger` en la pantalla y, al recibir el foco,
 * `ProductSearchDialog` con el predictivo.
 */
export function ProductSearch({
  search = fetchProducts,
  onSelect,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  className,
}: ProductSearchProps) {
  const [open, setOpen] = useControllableState(
    openProp,
    onOpenChange,
    defaultOpen
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const { query, setQuery, results, isLoading, hasError } =
    useProductSearch(search)

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setQuery("")
      setActiveIndex(0)
    }
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery)
    setActiveIndex(0)
  }

  function handleSelect(product: Product) {
    onSelect?.(product)
    handleOpenChange(false)
  }

  return (
    <>
      <SearchTrigger onActivate={() => setOpen(true)} className={className} />
      <ProductSearchDialog
        open={open}
        onOpenChange={handleOpenChange}
        query={query}
        onQueryChange={handleQueryChange}
        results={results}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
        isLoading={isLoading}
        hasError={hasError}
        onSelect={handleSelect}
      />
    </>
  )
}
