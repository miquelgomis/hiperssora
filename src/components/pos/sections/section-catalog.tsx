"use client"

import { useState } from "react"

import type { Section } from "@/config/sections"
import { useControllableState } from "@/hooks/use-controllable-state"
import { useScale } from "@/hooks/use-scale"
import { useSectionCatalog } from "@/hooks/use-section-catalog"
import { fetchSectionCatalog, type SectionCatalogFn } from "@/lib/product-api"
import { isSoldLoose, toWeighedProduct, withoutFormat } from "@/lib/ticket"
import type { Product } from "@/types/pos"

import { QuantityDialog } from "./quantity-dialog"
import { ScaleDialog } from "./scale-dialog"
import { SectionButtons } from "./section-buttons"
import { SectionCatalogDialog } from "./section-catalog-dialog"

export type SectionCatalogProps = {
  /** Carga del catálogo. Por defecto, el real de Nutriinfo (`/api/products`). */
  load?: SectionCatalogFn
  /**
   * Producto confirmado con su cantidad: kilos que marcó la báscula (Frutería, Verdulería) o
   * piezas elegidas (Panadería).
   */
  onSelect?: (product: Product, quantity: number) => void
  /** Sección abierta de inicio (útil para documentar). */
  defaultSection?: Section | null
  /** Control externo de la sección abierta (p. ej., abrirla con F5–F7). */
  section?: Section | null
  onSectionChange?: (section: Section | null) => void
  className?: string
}

/**
 * Flujo de las secciones: `SectionButtons` → `SectionCatalogDialog` → `ScaleDialog` (al peso)
 * o `QuantityDialog` (por pieza).
 * Las secciones solo muestran productos **sueltos** (formato Pieza, 1/2 Pieza o Granel); los
 * envasados no aparecen porque tienen su propio código de barras. En Frutería y Verdulería se
 * pesan (`ScaleDialog` → carrito en kilos); en Panadería (bollería suelta) se elige cuántas
 * piezas (`QuantityDialog`). La báscula sustituye al catálogo (nunca hay dos
 * modales a la vez) y *Volver* lo reabre tal como estaba.
 */
export function SectionCatalog({
  load = fetchSectionCatalog,
  onSelect,
  defaultSection = null,
  section: sectionProp,
  onSectionChange,
  className,
}: SectionCatalogProps) {
  const [section, setSection] = useControllableState(
    sectionProp,
    onSectionChange,
    defaultSection
  )
  const [weighing, setWeighing] = useState<Product | null>(null)
  const [counting, setCounting] = useState<Product | null>(null)
  const catalog = useSectionCatalog(load, section)
  const scale = useScale(weighing)

  // Al peso, a la báscula; por pieza, a elegir cuántas.
  function handleSelect(product: Product) {
    if (section?.soldBy === "weight") setWeighing(product)
    else setCounting(product)
  }

  /** Báscula o cantidad confirmadas: se añade al carrito y se cierra todo. */
  function handleConfirm(product: Product, quantity: number) {
    onSelect?.(product, quantity)
    setWeighing(null)
    setCounting(null)
    setSection(null)
  }

  return (
    <>
      <SectionButtons onSelect={setSection} className={className} />
      <SectionCatalogDialog
        section={section}
        // La báscula o la cantidad sustituyen al catálogo: nunca hay dos modales a la vez.
        open={section !== null && weighing === null && counting === null}
        {...catalog}
        // Solo los productos sueltos: los envasados tienen su propio código de barras y entran
        // con la pistola o el buscador.
        products={catalog.products
          .filter(isSoldLoose)
          .map((product) =>
            section?.soldBy === "weight"
              ? toWeighedProduct(product)
              : withoutFormat(product)
          )}
        onOpenChange={(open) => !open && setSection(null)}
        onSelect={handleSelect}
      />
      <ScaleDialog
        product={weighing}
        weight={scale.weight}
        onReweigh={scale.reweigh}
        onBack={() => setWeighing(null)}
        onConfirm={handleConfirm}
      />
      <QuantityDialog
        product={counting}
        onBack={() => setCounting(null)}
        onConfirm={handleConfirm}
      />
    </>
  )
}
