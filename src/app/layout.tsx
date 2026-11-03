import type { Metadata, Viewport } from "next"

import { fontVariables } from "@/lib/fonts"
import { cn } from "@/lib/utils"

import "./globals.css"

const title = "Hiperssora · TPV"
const description =
  "Caja registradora de los supermercados Hiperssora: ticket, buscador de productos, secciones al peso y cobro con tarjeta o en efectivo."

// Iconos e imagen para compartir: favicon.ico, icon.svg, apple-icon.png y
// opengraph-image.png en esta carpeta (convenciones de archivo de Next).
export const metadata: Metadata = {
  title,
  description,
  applicationName: title,
  // Herramienta interna: que no la indexe ningún buscador (ver también robots.ts).
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Hiperssora",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
}

export const viewport: Viewport = { themeColor: "#ffffff" }

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={cn(fontVariables, "h-full antialiased")}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
