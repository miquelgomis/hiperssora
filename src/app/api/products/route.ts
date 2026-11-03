import type { NextRequest } from "next/server"

import { listNutriinfoCategory, searchNutriinfo } from "@/lib/nutriinfo"

/**
 * GET /api/products?q=leche → búsqueda por texto o EAN.
 * GET /api/products?category=<id> → catálogo de una categoría de Nutriinfo.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const query = params.get("q")?.trim() ?? ""
  const category = params.get("category")

  try {
    if (category) return Response.json(await listNutriinfoCategory(category))
    if (query) return Response.json(await searchNutriinfo(query))
    return Response.json([])
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: "No se pudo consultar el catálogo" },
      { status: 502 }
    )
  }
}
