"use client"

import { useEffect, useRef } from "react"
import { ArrowLeft, Scale, ShoppingCart } from "lucide-react"

import {
  MockupNote,
  Modal,
  ProductThumbnail,
  SummaryRow,
} from "@/components/common"
import { Button } from "@/components/ui/button"
import { formatPrice, formatUnitPrice } from "@/lib/format"
import { moveGridFocus } from "@/lib/grid-navigation"
import type { Product } from "@/types/pos"

import { ScaleDisplay } from "./scale-display"

export type ScaleDialogProps = {
  /** Producto en la báscula, ya en su versión al peso (`unit: "kg"`). Con `null`, cerrado. */
  product: Product | null
  /** Peso leído en kg. `null` mientras la báscula pesa. */
  weight: number | null
  /** "Volver a pesar": repite la lectura si el peso no es correcto. */
  onReweigh?: () => void
  /** "Volver": regresa al catálogo de la sección. */
  onBack?: () => void
  /** "Añadir al carrito" con el peso leído. */
  onConfirm?: (product: Product, weight: number) => void
  /** Aviso de maqueta bajo el importe (p. ej., que la báscula es simulada). */
  mockupNote?: string
}

/**
 * Báscula. Se abre al elegir un producto de Frutería, Verdulería o Panadería: muestra
 * *Pesando…* y, cuando el peso se estabiliza, el peso, el precio por kilo y el importe.
 * Si el peso no es correcto, **Volver a pesar** repite la lectura. El cajero confirma con
 * **Añadir al carrito** o vuelve al catálogo.
 *
 * Teclado: mientras pesa, Enter no hace nada; cuando el peso se estabiliza, el foco pasa a
 * *Añadir al carrito*, así que Enter añade. ← → recorren los botones y Esc vuelve al catálogo.
 */
export function ScaleDialog({
  product,
  weight,
  onReweigh,
  onBack,
  onConfirm,
  mockupNote,
}: ScaleDialogProps) {
  const isWeighing = weight === null
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const displayRef = useRef<HTMLDivElement>(null)

  // En cuanto el peso se estabiliza, Enter añade al carrito: el foco pasa a ese botón.
  useEffect(() => {
    if (weight !== null) addButtonRef.current?.focus()
  }, [weight])

  return (
    <Modal
      open={product !== null}
      onOpenChange={(open) => !open && onBack?.()}
      size="lg"
      align="start"
      media={
        <ProductThumbnail
          src={product?.imageUrl}
          alt={product?.name ?? ""}
          size="lg"
        />
      }
      title={product?.name}
      description={product && formatUnitPrice(product.price, product.unit)}
      // Con peso, el foco empieza en Añadir al carrito; mientras pesa, en el visor (así un
      // Enter impaciente no pulsa Volver).
      initialFocus={weight !== null ? addButtonRef : displayRef}
      finalFocus={false}
      // ← → recorren Volver a pesar, Volver y Añadir al carrito.
      onKeyDown={(event) => {
        if (moveGridFocus(event.currentTarget, event.key) !== "ignored")
          event.preventDefault()
        // Mientras pesa, Enter no hace nada.
        if (event.key === "Enter" && isWeighing) event.preventDefault()
      }}
      footer={
        <>
          <Button variant="outline" size="xl" onClick={onBack}>
            <ArrowLeft aria-hidden />
            Volver
          </Button>
          <Button
            ref={addButtonRef}
            size="xl"
            disabled={isWeighing}
            onClick={() =>
              product && weight !== null && onConfirm?.(product, weight)
            }
          >
            <ShoppingCart aria-hidden />
            Añadir al carrito
          </Button>
        </>
      }
    >
      <ScaleDisplay ref={displayRef} weight={weight} onReweigh={onReweigh} />

      <SummaryRow
        label="Importe"
        value={
          isWeighing || !product ? "—" : formatPrice(product.price * weight)
        }
        size="xl"
      />

      {mockupNote && <MockupNote icon={Scale}>{mockupNote}</MockupNote>}
    </Modal>
  )
}
