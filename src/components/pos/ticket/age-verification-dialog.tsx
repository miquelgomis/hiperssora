"use client"

import { IdCard } from "lucide-react"

import { ConfirmDialog } from "@/components/common"
import type { Product } from "@/types/pos"

import { ProductSummary } from "./product-summary"

export type AgeVerificationDialogProps = {
  /** Producto +18 que se quiere añadir. Con `null`, cerrado. */
  product: Product | null
  /** "Sí, es mayor de 18": se añade y la compra queda verificada. */
  onConfirm?: () => void
  /** "No, no añadir": el producto no entra en el ticket. */
  onCancel?: () => void
}

/**
 * Verificación de edad. Aparece al añadir el **primer** producto +18 (alcohol) de una compra.
 * Si el cajero confirma, el producto se añade y la compra queda verificada: los siguientes
 * productos +18 entran sin volver a preguntar.
 */
export function AgeVerificationDialog({
  product,
  onConfirm,
  onCancel,
}: AgeVerificationDialogProps) {
  return (
    <ConfirmDialog
      open={product !== null}
      onOpenChange={(open) => !open && onCancel?.()}
      icon={IdCard}
      // Ancho: los nombres de Nutriinfo son largos («Cerveza … · Pack-12 latas 33 cl»).
      size="2xl"
      // Pregunta rutinaria: Enter confirma (el cajero ya ha comprobado la edad).
      defaultFocus="confirm"
      title="¿El cliente es mayor de 18 años?"
      description="Este producto solo se puede vender a mayores de edad. Pide el DNI si tienes dudas."
      cancelLabel="No, no añadir"
      confirmLabel="Sí, es mayor de 18"
      onConfirm={onConfirm}
    >
      {product && <ProductSummary product={product} />}
    </ConfirmDialog>
  )
}
