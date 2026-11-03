import type { Product } from "@/types/pos"

// Cliente de la API de Nutriinfo (https://www.nutriinfo.es/desarrolladores).
// Solo se usa en el servidor: la clave vive en NUTRIINFO_API_KEY (.env) y nunca llega al navegador.

const API_URL = "https://www.nutriinfo.es/api/v1"

/** Por encima de esta graduación (% vol) es bebida alcohólica: solo para mayores de 18. */
const ALCOHOL_LIMIT = 1.2

/**
 * Campos que usa el TPV. La búsqueda por texto devuelve `ProductoResumen` (con `imagen`) y la
 * de EAN devuelve la ficha completa (con `imagenes` y `es_granel`).
 */
type NutriinfoProduct = {
  id: string
  nombre: string
  formato: string | null
  ean: string | null
  categoria: { id: string } | null
  precio: {
    /** Euros por unidad de venta, o por kilo en lo que se vende a granel. */
    precio: number
    /** Euros por kg, l o unidad, según `unidad_referencia`. */
    precio_por_unidad: number | null
    unidad_referencia: "kg" | "l" | "ud" | null
  } | null
  /** Graduación de las bebidas alcohólicas, en % vol. */
  graduacion_alcohol?: number | null
  imagen?: string | null
  imagenes?: { media: string }[]
  es_granel?: boolean
}

/**
 * Busca productos por nombre o por código EAN, completo o parcial.
 *
 * - Un EAN completo (8 a 14 dígitos, p. ej., una lectura de la pistola) se busca primero
 *   exacto: devuelve la ficha completa, que dice si se vende a granel.
 * - Si no hay coincidencia exacta, o es texto o un fragmento de código, se usa la búsqueda
 *   por texto, que con 4 o más dígitos encuentra los EAN que los contienen. Los que empiezan
 *   por el fragmento van primero.
 */
export async function searchNutriinfo(
  query: string,
  limit = 50
): Promise<Product[]> {
  if (/^\d{8,14}$/.test(query)) {
    const exact = await request(`${API_URL}/productos/ean/${query}`)
    if (exact.length > 0) return exact.slice(0, limit)
  }

  const results = await request(
    `${API_URL}/productos?${new URLSearchParams({
      texto: query,
      catalogo: "todo",
      por_pagina: String(limit),
    })}`
  )
  // Con un fragmento de código, primero los EAN que empiezan por él (la API ordena por nombre).
  const startsWithQuery = (product: Product) => product.ean.startsWith(query)
  return results
    .toSorted((a, b) => Number(startsWithQuery(b)) - Number(startsWithQuery(a)))
    .slice(0, limit)
}

/**
 * Todos los productos de una categoría (y sus subcategorías), ordenados por nombre. La API
 * devuelve como mucho 100 por página, así que se recorren todas.
 */
export async function listNutriinfoCategory(
  categoryId: string
): Promise<Product[]> {
  const products: Product[] = []
  for (let page = 1, pages = 1; page <= pages; page++) {
    const result = await requestPage(
      `${API_URL}/productos?${new URLSearchParams({
        categoria: categoryId,
        por_pagina: "100",
        pagina: String(page),
      })}`
    )
    products.push(...result.products)
    pages = result.pages
  }
  return products
}

async function request(url: string): Promise<Product[]> {
  return (await requestPage(url)).products
}

async function requestPage(
  url: string
): Promise<{ products: Product[]; pages: number }> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.NUTRIINFO_API_KEY}` },
  })
  // El endpoint de EAN responde 404 cuando no hay ningún producto con ese código.
  if (response.status === 404) return { products: [], pages: 0 }
  if (!response.ok) throw new Error(`Nutriinfo respondió ${response.status}`)

  const { datos, paginacion } = (await response.json()) as {
    datos: NutriinfoProduct[]
    paginacion?: { paginas: number }
  }
  return { products: datos.map(toProduct), pages: paginacion?.paginas ?? 1 }
}

function toProduct(product: NutriinfoProduct): Product {
  return {
    id: product.id,
    // El formato distingue variantes con el mismo nombre (brik, botella, pack-6…).
    name: product.formato
      ? `${product.nombre} · ${product.formato}`
      : product.nombre,
    format: product.formato ?? undefined,
    ean: product.ean ?? "",
    price: product.precio?.precio ?? 0,
    // Solo la ficha (búsqueda por EAN) dice si se vende al peso; la búsqueda por texto, no.
    unit: product.es_granel ? "kg" : "unit",
    ageRestricted: (product.graduacion_alcohol ?? 0) > ALCOHOL_LIMIT,
    pricePerKg:
      product.precio?.unidad_referencia === "kg"
        ? (product.precio.precio_por_unidad ?? undefined)
        : undefined,
    categoryId: product.categoria?.id ?? "",
    imageUrl: product.imagen ?? product.imagenes?.[0]?.media,
  }
}
