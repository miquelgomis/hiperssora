import { useEffect, useState } from "react"

import type { ProductSearchFn } from "@/lib/product-api"
import { isSoldLoose } from "@/lib/ticket"
import type { Product } from "@/types/pos"

const DEBOUNCE_MS = 250

/**
 * Estado del buscador de productos: texto escrito, resultados, carga y error.
 * Espera a que el cajero deje de escribir (250 ms) antes de llamar a `search`. No muestra los
 * productos sueltos (`isSoldLoose`), que se eligen en Frutería, Verdulería o Panadería.
 */
export function useProductSearch(search: ProductSearchFn) {
  const [query, setQueryState] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const term = query.trim()

  function setQuery(nextQuery: string) {
    setQueryState(nextQuery)
    setIsLoading(nextQuery.trim().length > 0)
    setHasError(false)
  }

  useEffect(() => {
    if (!term) return
    // Descarta la respuesta si el texto cambia antes de que llegue.
    let isCurrent = true

    const timer = setTimeout(async () => {
      try {
        const products = await search(term)
        // Los productos sueltos (kiwi verde, banana…) no salen: se eligen en su sección.
        if (isCurrent)
          setResults(products.filter((product) => !isSoldLoose(product)))
      } catch {
        if (isCurrent) setHasError(true)
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      isCurrent = false
      clearTimeout(timer)
    }
  }, [term, search])

  return {
    query,
    setQuery,
    // Mientras llega la respuesta se mantienen los resultados anteriores para evitar parpadeos.
    results: term ? results : [],
    isLoading,
    hasError,
  }
}
