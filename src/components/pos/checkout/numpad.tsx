"use client"

import { Delete } from "lucide-react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { NumpadDisplay } from "./numpad-display"

export type NumpadKey =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | ","
  | "backspace"
  | "clear"
  | "multiply"
  | "quantity"

type KeyDefinition = {
  key: NumpadKey
  label: ReactNode
  ariaLabel?: string
  variant?: "outline" | "secondary"
  className?: string
}

// Orden de lectura de la rejilla de 4 columnas. Multiplicar no tiene tecla en pantalla: se
// hace con `*` en el teclado físico.
const KEYS: KeyDefinition[] = [
  { key: "7", label: "7" },
  { key: "8", label: "8" },
  { key: "9", label: "9" },
  {
    key: "backspace",
    label: <Delete />,
    ariaLabel: "Borrar",
    variant: "secondary",
  },
  { key: "4", label: "4" },
  { key: "5", label: "5" },
  { key: "6", label: "6" },
  { key: "clear", label: "C", ariaLabel: "Limpiar", variant: "secondary" },
  { key: "1", label: "1" },
  { key: "2", label: "2" },
  { key: "3", label: "3" },
  // Doble de alto: ocupa las dos últimas filas de la cuarta columna.
  {
    key: "quantity",
    label: "Cantidad",
    variant: "secondary",
    className: "row-span-2 h-auto text-base",
  },
  { key: "0", label: "0", className: "col-span-2" },
  { key: ",", label: ",", ariaLabel: "Coma decimal" },
]

export type NumpadProps = {
  /**
   * Número del visor ("16", "1,250"…). Sin teclear, es la cantidad de la línea seleccionada;
   * al teclear, el número nuevo.
   */
  value?: string
  /** Producto de la línea seleccionada, que se muestra junto a *Cantidad*. */
  productName?: string
  /** Unidad de la cantidad del visor ("ud" o "kg"), para que no haya dudas. */
  unitLabel?: string
  /** Hay un número tecleado sin aplicar: el visor se resalta hasta pulsar *Cantidad*. */
  isEditing?: boolean
  /**
   * Multiplicador activo: tras pulsar ×, el valor se aplicará como cantidad
   * al siguiente producto que entre en el ticket.
   */
  isMultiplying?: boolean
  /** Permite la coma decimal (productos al peso). */
  allowDecimal?: boolean
  /** Hay una línea seleccionada a la que aplicar *Cantidad*. */
  canApplyQuantity?: boolean
  /**
   * Muestra las teclas en pantalla. Con `false`, solo el visor: la cantidad se teclea en el
   * teclado físico de la caja.
   */
  showKeys?: boolean
  onKeyPress?: (key: NumpadKey) => void
  className?: string
}

/**
 * Teclado numérico táctil con visor.
 *
 * - El visor muestra la cantidad de la línea seleccionada del ticket.
 * - `2` `4` + `Cantidad` → la línea seleccionada pasa a 24. Tras aplicar, el visor vuelve a
 *   mostrar la cantidad actual.
 * - `⌫` borra un dígito y `C` descarta lo tecleado.
 * - La coma solo se admite en productos al peso (`1,5` + `Cantidad` → 1,500 kg).
 * - Multiplicar: `6` + `*` en el teclado físico → el siguiente producto entra con cantidad 6
 *   (el visor muestra `6 ×`). No tiene tecla en pantalla.
 * - *Cantidad* ocupa dos filas y se ilumina en rojo cuando hay un número que aplicar.
 * - Con `showKeys={false}` solo se ve el visor (la caja tiene teclado físico).
 */
export function Numpad({
  value = "",
  productName,
  unitLabel,
  isEditing = false,
  isMultiplying = false,
  allowDecimal = true,
  canApplyQuantity = true,
  showKeys = true,
  onKeyPress,
  className,
}: NumpadProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <NumpadDisplay
        value={value}
        unitLabel={unitLabel}
        productName={productName}
        isEditing={isEditing}
        isMultiplying={isMultiplying}
        applyKey={showKeys ? "Cantidad" : "Enter"}
      />

      {showKeys && (
        <div className="grid animate-in grid-cols-4 gap-2 duration-200 fade-in-0 slide-in-from-top-1">
          {KEYS.map(
            ({ key, label, ariaLabel, variant = "outline", className }) => (
              <Button
                key={key}
                // Cantidad se ilumina cuando hay un número tecleado que aplicar.
                variant={key === "quantity" && isEditing ? "default" : variant}
                size="xl"
                aria-label={ariaLabel}
                disabled={
                  (key === "," && !allowDecimal) ||
                  (key === "quantity" && !(canApplyQuantity && isEditing))
                }
                onClick={() => onKeyPress?.(key)}
                className={cn(
                  "h-12 text-2xl font-medium tabular-nums short:h-10",
                  className
                )}
              >
                {label}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  )
}
