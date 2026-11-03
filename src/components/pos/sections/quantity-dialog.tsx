"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import { ArrowLeft, ShoppingCart } from "lucide-react"

import {
  Modal,
  ProductThumbnail,
  QuantityStepper,
  SummaryRow,
} from "@/components/common"
import { Button } from "@/components/ui/button"
import { formatPrice, formatUnitPrice } from "@/lib/format"
import { moveGridFocus } from "@/lib/grid-navigation"
import type { Product } from "@/types/pos"

const MAX_QUANTITY = 99

export type QuantityDialogProps = {
  /** Producto por pieza elegido (p. ej., un croissant). Con `null`, cerrado. */
  product: Product | null
  /** "Volver": regresa al catálogo de la sección. */
  onBack?: () => void
  /** "Añadir al carrito" con la cantidad elegida. */
  onConfirm?: (product: Product, quantity: number) => void
}

/**
 * Cantidad de un producto que se vende por pieza (la bollería suelta de Panadería): cuántos
 * croissants, bollitos… Sustituye al catálogo, como la báscula, y empieza en 1.
 *
 * Teclado: los dígitos escriben la cantidad (`5` → 5), `+`/`−` suman o restan, `⌫` borra;
 * el foco empieza en *Añadir al carrito*, así que Enter añade. ← → recorren los botones y Esc
 * vuelve al catálogo.
 */
export function QuantityDialog({
  product,
  onBack,
  onConfirm,
}: QuantityDialogProps) {
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const [quantity, setQuantity] = useState(1)
  // Hasta teclear el primer dígito, la cantidad es la propuesta (1) y se sustituye.
  const [isTyping, setIsTyping] = useState(false)

  // Con cada producto nuevo, la cantidad vuelve a 1.
  const [productId, setProductId] = useState(product?.id)
  if (product && product.id !== productId) {
    setProductId(product.id)
    setQuantity(1)
    setIsTyping(false)
  }

  const clamp = (value: number) => Math.min(Math.max(value, 1), MAX_QUANTITY)

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const { key } = event
    let handled = true
    if (/^\d$/.test(key)) {
      const typed = isTyping ? Number(`${quantity}${key}`) : Number(key)
      setQuantity(clamp(typed))
      setIsTyping(true)
    } else if (key === "Backspace") {
      setQuantity(clamp(Math.floor(quantity / 10)))
    } else if (key === "+") {
      setQuantity(clamp(quantity + 1))
      setIsTyping(false)
    } else if (key === "-") {
      setQuantity(clamp(quantity - 1))
      setIsTyping(false)
    } else {
      handled = moveGridFocus(event.currentTarget, key) !== "ignored"
    }
    if (handled) event.preventDefault()
  }

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
      initialFocus={addButtonRef}
      finalFocus={false}
      onKeyDown={handleKeyDown}
      footer={
        <>
          <Button variant="outline" size="xl" onClick={onBack}>
            <ArrowLeft aria-hidden />
            Volver
          </Button>
          <Button
            ref={addButtonRef}
            size="xl"
            onClick={() => product && onConfirm?.(product, quantity)}
          >
            <ShoppingCart aria-hidden />
            Añadir al carrito
          </Button>
        </>
      }
    >
      <div className="flex items-center justify-between rounded-2xl border-2 border-brand bg-brand-soft px-5 py-5">
        <span className="text-sm text-muted-foreground">Cantidad</span>
        <QuantityStepper
          size="lg"
          value={quantity}
          onDecrease={() => setQuantity(clamp(quantity - 1))}
          onIncrease={() => setQuantity(clamp(quantity + 1))}
          decreaseDisabled={quantity <= 1}
          increaseDisabled={quantity >= MAX_QUANTITY}
        />
      </div>

      <SummaryRow
        label="Importe"
        value={formatPrice((product?.price ?? 0) * quantity)}
        size="xl"
      />
    </Modal>
  )
}
