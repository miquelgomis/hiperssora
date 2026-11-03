import type { ProductSearchFn, SectionCatalogFn } from "@/lib/product-api"
import { searchProducts } from "@/lib/search"

import { catalog } from "./products"

const delay = () => new Promise((resolve) => setTimeout(resolve, 300))

/** Búsqueda simulada para Storybook: filtra el catálogo de ejemplo con un pequeño retardo. */
export const mockSearch: ProductSearchFn = async (query) => {
  await delay()
  return searchProducts(catalog, query, 8)
}

/** Búsqueda que siempre falla, para documentar el estado de error. */
export const failingSearch: ProductSearchFn = async () => {
  throw new Error("Sin conexión")
}

/** Catálogo simulado de cada sección para Storybook. */
export const mockSectionCatalog: SectionCatalogFn = async (section) => {
  await delay()
  return catalog.filter((product) => product.categoryId === section.id)
}
