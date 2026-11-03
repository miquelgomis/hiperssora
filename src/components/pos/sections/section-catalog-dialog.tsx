"use client"

import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
} from "react"
import { Loader2, PackageOpen, SearchX, WifiOff } from "lucide-react"

import { EmptyState, IconTile, SearchField } from "@/components/common"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Section } from "@/config/sections"
import { moveGridFocus } from "@/lib/grid-navigation"
import { searchProducts } from "@/lib/search"
import type { Product } from "@/types/pos"

import { ProductTile } from "./product-tile"

export type SectionCatalogDialogProps = {
  /** Sección abierta. Con `null`, el modal está cerrado. */
  section: Section | null
  /**
   * Oculta el modal sin perder la sección, la búsqueda ni el scroll (mientras se pesa un
   * producto en la báscula). Por defecto, abierto si hay sección.
   */
  open?: boolean
  products: Product[]
  isLoading?: boolean
  hasError?: boolean
  onOpenChange?: (open: boolean) => void
  /** Producto elegido: pasa a la báscula (`ScaleDialog`). */
  onSelect?: (product: Product) => void
}

/**
 * Modal a pantalla completa con el catálogo de una sección (Frutería, Verdulería o Panadería),
 * en una rejilla de productos grandes con su precio por kilo, con tantas columnas como quepan
 * (mínimo 176 px por producto). Arriba hay un buscador que filtra al instante por nombre o EAN.
 *
 * Teclado: al abrir, el foco está en el primer producto; las flechas recorren la rejilla,
 * Enter pesa el producto y escribir lleva al buscador (↓ vuelve a la rejilla).
 *
 * Al elegir un producto se abre la báscula en su lugar (nunca hay dos modales a la vez) y, al
 * volver, el catálogo reaparece tal como estaba: misma búsqueda, mismo scroll y el foco en el
 * producto que se estaba pesando. Se cierra con la X o con `Esc`.
 */
export function SectionCatalogDialog({
  section,
  open = section !== null,
  onOpenChange,
  ...contentProps
}: SectionCatalogDialogProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  // Último producto enfocado, para volver a él al regresar de la báscula.
  const lastFocusedIndexRef = useRef(0)

  // Al mostrarse el modal, el foco va al producto: el último usado o el primero. Si aún está
  // cargando, se usa el foco por defecto y CatalogContent lo mueve al cargar.
  function getInitialFocus() {
    const tiles = gridRef.current?.querySelectorAll("button")
    return (
      tiles?.[Math.min(lastFocusedIndexRef.current, tiles.length - 1)] ?? true
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        keepMounted
        initialFocus={getInitialFocus}
        finalFocus={false}
        className="inset-6 flex h-auto w-auto max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-none"
      >
        {/* La key reinicia el buscador al cambiar de sección. */}
        {section && (
          <CatalogContent
            key={section.id}
            section={section}
            open={open}
            gridRef={gridRef}
            lastFocusedIndexRef={lastFocusedIndexRef}
            {...contentProps}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function CatalogContent({
  section,
  products,
  isLoading = false,
  hasError = false,
  onSelect,
  open,
  gridRef,
  lastFocusedIndexRef,
}: Omit<SectionCatalogDialogProps, "section" | "onOpenChange"> & {
  section: Section
  gridRef: RefObject<HTMLDivElement | null>
  lastFocusedIndexRef: RefObject<number>
}) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const term = query.trim()
  const visibleProducts = term
    ? searchProducts(products, term, products.length)
    : products
  const isReady = open && !isLoading && products.length > 0

  // Si el catálogo termina de cargar con el modal ya abierto, el foco va al primer producto.
  useEffect(() => {
    if (!isReady) return
    const frame = requestAnimationFrame(() => {
      if (gridRef.current?.contains(document.activeElement)) return
      const tiles = gridRef.current?.querySelectorAll("button")
      tiles?.[Math.min(lastFocusedIndexRef.current, tiles.length - 1)]?.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [isReady, gridRef, lastFocusedIndexRef])

  function handleGridKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const move = moveGridFocus(event.currentTarget, event.key)
    if (move !== "ignored") event.preventDefault()
    if (move === "edge-top") inputRef.current?.focus()
    // Escribir desde la rejilla lleva el texto al buscador.
    const isPrintable =
      event.key.length === 1 && !event.ctrlKey && !event.metaKey
    if (isPrintable && event.key !== " ") inputRef.current?.focus()
  }

  function handleGridFocus(event: FocusEvent<HTMLDivElement>) {
    const tiles = [...event.currentTarget.querySelectorAll("button")]
    const index = tiles.findIndex((tile) => tile.contains(event.target))
    if (index !== -1) lastFocusedIndexRef.current = index
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowDown") return
    event.preventDefault()
    gridRef.current?.querySelector("button")?.focus()
  }

  return (
    <>
      <DialogHeader className="flex-row items-center gap-6 border-b py-5 pr-24 pl-8">
        <IconTile icon={section.icon} size="md" />
        <div className="flex shrink-0 flex-col gap-1">
          <DialogTitle>{section.name}</DialogTitle>
          <DialogDescription>
            {isLoading
              ? "Cargando productos…"
              : `${visibleProducts.length} productos · toca uno para ${
                  section.soldBy === "weight" ? "pesarlo" : "añadirlo"
                }`}
          </DialogDescription>
        </div>

        <SearchField
          ref={inputRef}
          variant="box"
          value={query}
          onValueChange={(value) => {
            setQuery(value)
            lastFocusedIndexRef.current = 0
          }}
          onKeyDown={handleInputKeyDown}
          placeholder={`Buscar en ${section.name}…`}
          aria-label={`Buscar en ${section.name}`}
          className="ml-auto w-full max-w-xl"
        />
      </DialogHeader>

      <div className="min-h-0 flex-1 overflow-y-auto p-8">
        {hasError ? (
          <EmptyState
            icon={WifiOff}
            title="No se ha podido cargar el catálogo"
            description="Comprueba la conexión, cierra y vuelve a abrir la sección"
          />
        ) : isLoading ? (
          <EmptyState
            icon={Loader2}
            iconClassName="animate-spin"
            title="Cargando productos…"
          />
        ) : visibleProducts.length === 0 ? (
          <EmptyState
            icon={term ? SearchX : PackageOpen}
            title={
              term
                ? `Sin resultados para «${term}» en ${section.name}`
                : "No hay productos en esta sección"
            }
          />
        ) : (
          <div
            ref={gridRef}
            onKeyDown={handleGridKeyDown}
            onFocus={handleGridFocus}
            className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-4"
          >
            {visibleProducts.map((product) => (
              <ProductTile
                key={product.id}
                product={product}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
