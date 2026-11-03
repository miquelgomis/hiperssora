import type { Section } from "@/config/sections"
import type { Product } from "@/types/pos"

/** Función de búsqueda que usa el buscador. Se inyecta para poder simularla en Storybook. */
export type ProductSearchFn = (query: string) => Promise<Product[]>

/** Carga el catálogo de una sección (Frutería, Verdulería, Panadería). */
export type SectionCatalogFn = (section: Section) => Promise<Product[]>

/** Busca en el catálogo real a través de `/api/products` (Nutriinfo). */
export const fetchProducts: ProductSearchFn = (query) =>
  getProducts({ q: query })

/** Catálogo real de la sección, a través de `/api/products` (Nutriinfo). */
export const fetchSectionCatalog: SectionCatalogFn = (section) =>
  getProducts({ category: section.categoryId })

async function getProducts(params: Record<string, string>): Promise<Product[]> {
  const response = await fetch(`/api/products?${new URLSearchParams(params)}`)
  if (!response.ok) throw new Error(`Petición fallida (${response.status})`)
  return response.json()
}
