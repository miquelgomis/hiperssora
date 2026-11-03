import type { MetadataRoute } from "next"

/** TPV interno: ningún buscador debe rastrearlo ni indexarlo. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } }
}
