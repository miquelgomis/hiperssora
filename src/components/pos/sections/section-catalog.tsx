"use client"

import { useState } from "react"

import type { Section } from "@/config/sections"
import { useControllableState } from "@/components/hooks"
import type { Product } from "@/types/pos"

import { QuantityDialog } from "./quantity-dialog"
import { ScaleDialog } from "./scale-dialog"
import { SectionButtons } from "./section-buttons"
import { SectionCatalogDialog } from "./section-catalog-dialog"

/**
 * Lo que muestran las secciones: el catálogo de la sección abierta y la báscula. Lo pone quien
 * carga los datos y lee la báscula (en la app, `PosApp` con `useSectionCatalog` y `useScale`).
 */
export type SectionCatalogState = {
  /** Productos de la sección abierta, ya listos para vender (solo sueltos). */
  products?: Product[]
  /** Catálogo cargando. */
  isLoading?: boolean
  /** El catálogo no se ha podido cargar. */
  hasError?: boolean
  /** Producto en la báscula (control externo): quien lee la báscula necesita saberlo. */
  weighing?: Product | null
  onWeighingChange?: (product: Product | null) => void
  /** Peso en kg que marca la báscula, o `null` mientras se estabiliza. */
  weight?: number | null
  /** *Volver a pesar*: hay que repetir la lectura. */
  onReweigh?: () => void
  /** Aviso de maqueta en la báscula (p. ej., que es simulada). */
  scaleMockupNote?: string
}

export type SectionCatalogProps = SectionCatalogState & {
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
 *
 * Es solo interfaz: no carga el catálogo ni lee la báscula. Muestra los `products` y el
 * `weight` que recibe y avisa de lo que hace el cajero. En Frutería y Verdulería, el producto
 * elegido pasa a la báscula (`weighing`); en Panadería se elige cuántas piezas
 * (`QuantityDialog`). La báscula sustituye al catálogo (nunca hay dos modales a la vez) y
 * *Volver* lo reabre tal como estaba.
 */
export function SectionCatalog({
  products = [],
  isLoading,
  hasError,
  weighing: weighingProp,
  onWeighingChange,
  weight = null,
  onReweigh,
  scaleMockupNote,
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
  const [weighing, setWeighing] = useControllableState(
    weighingProp,
    onWeighingChange,
    null
  )
  const [counting, setCounting] = useState<Product | null>(null)

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
        products={products}
        isLoading={isLoading}
        hasError={hasError}
        onOpenChange={(open) => !open && setSection(null)}
        onSelect={handleSelect}
      />
      <ScaleDialog
        product={weighing}
        weight={weight}
        onReweigh={onReweigh}
        mockupNote={scaleMockupNote}
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
