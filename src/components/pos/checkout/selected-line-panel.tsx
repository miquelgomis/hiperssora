"use client"

import { ChevronDown, Keyboard } from "lucide-react"

import { Eyebrow, ProductThumbnail } from "@/components/common"
import { Button } from "@/components/ui/button"
import { usePersistentState } from "@/hooks/use-persistent-state"
import { cn } from "@/lib/utils"
import type { TicketLine } from "@/types/pos"

import { Numpad, type NumpadProps } from "./numpad"

/** Preferencia del cajero: teclas en pantalla desplegadas o no. Se recuerda entre recargas. */
const KEYPAD_STORAGE_KEY = "hiperssora-tpv:keypad-open"

export type SelectedLinePanelProps = {
  /** Línea seleccionada del ticket. Sin línea, la zona queda neutra. */
  line?: TicketLine
  numpad?: Omit<NumpadProps, "className" | "showKeys">
  /** Teclas desplegadas al inicio (útil para documentar). Por defecto, plegadas. */
  defaultKeypadOpen?: boolean
  className?: string
}

/**
 * Franja del panel de cobro que actúa sobre el **producto seleccionado**: su nombre y el visor
 * de la cantidad. Va fija al pie del panel, de borde a borde, sobre fondo gris claro, con la foto
 * y el nombre del producto que se está modificando (la línea seleccionada del ticket). Al
 * desplegar las teclas, crece hacia arriba.
 *
 * La caja tiene teclado físico, así que las teclas en pantalla van **plegadas**: la cantidad se
 * teclea en el teclado de la caja (dígitos + Enter). El botón *Teclado* las despliega.
 */
export function SelectedLinePanel({
  line,
  numpad,
  defaultKeypadOpen = false,
  className,
}: SelectedLinePanelProps) {
  const [isKeypadOpen, setIsKeypadOpen] = usePersistentState(
    KEYPAD_STORAGE_KEY,
    defaultKeypadOpen
  )

  return (
    <section
      aria-label="Producto seleccionado"
      className={cn(
        // Gris claro (el rojo se lee como un error) con desenfoque: al desplegar las teclas, lo que
        // queda detrás se intuye pero no se lee.
        "flex flex-col gap-2 border-t bg-muted/70 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex h-10 items-center gap-3">
        {line && (
          <ProductThumbnail
            src={line.product.imageUrl}
            alt={line.product.name}
            size="sm"
            className="bg-background"
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <Eyebrow>Producto seleccionado</Eyebrow>
          <span className="truncate text-base font-medium">
            {line?.product.name ??
              "Ninguno · teclea y pulsa * para multiplicar"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="lg"
          aria-expanded={isKeypadOpen}
          onClick={() => setIsKeypadOpen(!isKeypadOpen)}
          className="shrink-0 text-muted-foreground"
        >
          <Keyboard aria-hidden />
          Teclado
          <ChevronDown
            aria-hidden
            className={cn("transition-transform", isKeypadOpen && "rotate-180")}
          />
        </Button>
      </div>
      <Numpad {...numpad} productName={undefined} showKeys={isKeypadOpen} />
    </section>
  )
}
