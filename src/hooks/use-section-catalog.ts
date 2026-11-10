import { useEffect, useState } from "react"

import type { Section } from "@/config/sections"
import type { SectionCatalogFn } from "@/lib/product-api"
import { toSectionProducts } from "@/lib/ticket"
import type { Product } from "@/types/pos"

type CatalogState = {
  sectionId: Section["id"]
  products: Product[]
  hasError: boolean
}

/**
 * Carga el catálogo de la sección abierta y lo deja listo para mostrar: solo los productos
 * sueltos, al peso o por pieza (`toSectionProducts`). Con `section` nulo no hace nada.
 */
export function useSectionCatalog(
  load: SectionCatalogFn,
  section: Section | null
) {
  const [state, setState] = useState<CatalogState | null>(null)

  useEffect(() => {
    if (!section) return
    let isCurrent = true

    load(section)
      .then((products) => ({
        products: toSectionProducts(section, products),
        hasError: false,
      }))
      .catch(() => ({ products: [], hasError: true }))
      .then((result) => {
        if (isCurrent) setState({ sectionId: section.id, ...result })
      })

    return () => {
      isCurrent = false
    }
  }, [load, section])

  // Hasta que llega la respuesta de la sección abierta, se considera cargando.
  const isLoaded = section !== null && state?.sectionId === section.id
  return {
    products: isLoaded ? state.products : [],
    isLoading: section !== null && !isLoaded,
    hasError: isLoaded && state.hasError,
  }
}
