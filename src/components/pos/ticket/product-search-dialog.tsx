"use client"

import type { KeyboardEvent } from "react"
import { Loader2, SearchX, TextCursorInput, WifiOff } from "lucide-react"

import {
  EmptyState,
  HintBar,
  SearchField,
  ShortcutHint,
} from "@/components/common"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { shortcuts } from "@/config/shortcuts"
import type { Product } from "@/types/pos"

import { SearchResultItem } from "./search-result-item"

const KEY_HINTS = [
  { key: "↑ ↓", label: "Navegar" },
  { key: "Enter", label: "Añadir" },
  { key: shortcuts.exit.key, label: "Cerrar" },
]

export type ProductSearchDialogProps = {
  open: boolean
  onOpenChange?: (open: boolean) => void
  query: string
  onQueryChange?: (query: string) => void
  results: Product[]
  /** Índice del resultado activo. */
  activeIndex?: number
  onActiveIndexChange?: (index: number) => void
  /** Búsqueda en curso. */
  isLoading?: boolean
  /** La última búsqueda falló (p. ej., sin conexión). */
  hasError?: boolean
  onSelect?: (product: Product) => void
}

/**
 * Modal de búsqueda de productos. Se abre en cuanto el buscador del ticket recibe el foco.
 * Tiene título, X de cierre y fondo gris para que el cajero sepa siempre que está en un modal.
 *
 * Estados: vacío (aún no ha escrito), buscando, con resultados, sin resultados y error.
 */
export function ProductSearchDialog({
  open,
  onOpenChange,
  query,
  onQueryChange,
  results,
  activeIndex = 0,
  onActiveIndexChange,
  isLoading = false,
  hasError = false,
  onSelect,
}: ProductSearchDialogProps) {
  const hasQuery = query.trim().length > 0

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      onActiveIndexChange?.(Math.min(activeIndex + 1, results.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      onActiveIndexChange?.(Math.max(activeIndex - 1, 0))
    } else if (event.key === "Enter") {
      event.preventDefault()
      onSelect?.(results[activeIndex])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        finalFocus={false}
        className="top-[8vh] flex max-h-[84vh] translate-y-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl data-open:slide-in-from-top-4"
      >
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Buscar producto</DialogTitle>
          <DialogDescription>Por nombre o por código EAN</DialogDescription>
        </DialogHeader>

        {/* Misma barra que el buscador de la pantalla principal: de borde a borde. */}
        <SearchField
          autoFocus
          value={query}
          onValueChange={onQueryChange}
          isLoading={isLoading}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un nombre o un código…"
          aria-label="Buscar producto"
          aria-controls="product-search-results"
          className="border-t"
        />

        <div
          id="product-search-results"
          className="h-[26rem] min-h-0 shrink overflow-y-auto"
        >
          {!hasQuery ? (
            <EmptyState
              icon={TextCursorInput}
              title="Escribe para empezar a buscar"
              description="Por nombre, por ejemplo «leche», o con el código EAN o una parte: «8402001»"
            />
          ) : hasError ? (
            <EmptyState
              icon={WifiOff}
              title="No se ha podido buscar"
              description="Comprueba la conexión y vuelve a escribir para reintentarlo"
            />
          ) : results.length === 0 && isLoading ? (
            <EmptyState
              icon={Loader2}
              iconClassName="animate-spin"
              title="Buscando…"
              description={`Buscando «${query.trim()}» en el catálogo`}
            />
          ) : results.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title={`Sin resultados para «${query.trim()}»`}
              description="Revisa el nombre o prueba con otra parte del código EAN"
            />
          ) : (
            <ul
              role="listbox"
              aria-label="Resultados"
              className="grid grid-cols-[minmax(0,1fr)]"
            >
              {results.map((product, index) => (
                <SearchResultItem
                  key={product.id}
                  product={product}
                  query={query}
                  active={index === activeIndex}
                  onSelect={onSelect}
                  onActivate={() => onActiveIndexChange?.(index)}
                />
              ))}
            </ul>
          )}
        </div>

        <HintBar
          end={
            hasQuery &&
            !isLoading &&
            !hasError && (
              <span aria-live="polite" className="tabular-nums">
                {results.length}{" "}
                {results.length === 1 ? "resultado" : "resultados"}
              </span>
            )
          }
        >
          {KEY_HINTS.map(({ key, label }) => (
            <ShortcutHint key={key} keyLabel={key} label={label} />
          ))}
        </HintBar>
      </DialogContent>
    </Dialog>
  )
}
