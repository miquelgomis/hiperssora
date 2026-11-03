"use client"

import type { ComponentProps, ReactNode } from "react"
import { Loader2, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type SearchFieldProps = Omit<
  ComponentProps<typeof Input>,
  "type" | "value" | "onChange"
> & {
  value: string
  onValueChange?: (value: string) => void
  /** Buscando: un indicador junto al campo. */
  isLoading?: boolean
  /**
   * `bar` (por defecto): barra de borde a borde, sin esquinas y con una línea debajo, igual que
   * el buscador de la pantalla principal. `box`: campo con borde, dentro de una cabecera.
   */
  variant?: "bar" | "box"
  /** A la derecha, cuando el campo está vacío: p. ej., la tecla que lo abre (F2). */
  end?: ReactNode
}

/**
 * Campo de búsqueda táctil: lupa a la izquierda y, con texto, un botón para borrarlo. La barra
 * (`bar`) es la del buscador de productos, en la pantalla principal y en su modal; la caja (`box`), la del catálogo de cada sección. El buscador de la
 * pantalla principal (`SearchTrigger`) es este mismo campo, de solo lectura.
 */
export function SearchField({
  value,
  onValueChange,
  isLoading = false,
  variant = "bar",
  end,
  className,
  ...props
}: SearchFieldProps) {
  return (
    <div className={cn("relative", variant === "bar" && "border-b", className)}>
      <Search
        className={cn(
          "pointer-events-none absolute top-1/2 size-5 -translate-y-1/2 text-muted-foreground",
          variant === "bar" ? "left-6" : "left-5"
        )}
        aria-hidden
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
        className={cn(
          "pr-28 [&::-webkit-search-cancel-button]:appearance-none",
          variant === "bar"
            ? "h-16 rounded-none border-0 bg-background pl-14 text-base shadow-none focus-visible:ring-0 md:text-base dark:bg-background"
            : "h-14 rounded-xl pl-13 text-lg md:text-lg"
        )}
        {...props}
      />
      <div
        className={cn(
          "absolute top-1/2 flex -translate-y-1/2 items-center gap-2",
          variant === "bar" ? "right-4" : "right-2"
        )}
      >
        {isLoading && (
          <Loader2
            className="size-5 animate-spin text-muted-foreground"
            aria-label="Buscando"
          />
        )}
        {!value && end}
        {value && (
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="Borrar búsqueda"
            onClick={() => onValueChange?.("")}
            className="size-10 rounded-lg text-muted-foreground"
          >
            <X className="size-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
