"use client"

import { useState } from "react"

import { useControllableState } from "@/components/hooks"
import type { Product } from "@/types/pos"

import { ProductSearchDialog } from "./product-search-dialog"
import { SearchTrigger } from "./search-trigger"

/**
 * Lo que el buscador muestra mientras se escribe: el texto, los resultados y si está buscando
 * o ha fallado. Lo pone quien hace la búsqueda (en la app, `PosApp` con `useProductSearch`).
 */
export type ProductSearchState = {
  /** Texto escrito (control externo). */
  query?: string
  /** El cajero ha escrito: hay que buscar. Al cerrar el modal se llama con `""`. */
  onQueryChange?: (query: string) => void
  /** Resultados del texto escrito. */
  results?: Product[]
  /** Búsqueda en curso. */
  isLoading?: boolean
  /** La última búsqueda falló. */
  hasError?: boolean
}

export type ProductSearchProps = ProductSearchState & {
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
 *
 * Es solo interfaz: no busca. Avisa de lo que se escribe (`onQueryChange`) y muestra los
 * `results` que recibe. Solo gestiona lo visual: el modal abierto y el resultado activo.
 */
export function ProductSearch({
  query: queryProp,
  onQueryChange,
  results = [],
  isLoading = false,
  hasError = false,
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
  const [query, setQuery] = useControllableState(queryProp, onQueryChange, "")
  const [activeIndex, setActiveIndex] = useState(0)

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
