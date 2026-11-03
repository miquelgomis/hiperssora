"use client"

import { SearchField } from "@/components/common"
import { Kbd } from "@/components/ui/kbd"
import { shortcuts } from "@/config/shortcuts"

export type SearchTriggerProps = {
  /** Se llama al recibir el foco (toque, clic o Tab): abre el modal de búsqueda. */
  onActivate?: () => void
  className?: string
}

/**
 * Buscador de la pantalla principal. Es el mismo `SearchField` que hay dentro del modal, pero de
 * solo lectura: en cuanto recibe el foco abre `ProductSearchDialog`, donde se escribe de verdad.
 */
export function SearchTrigger({ onActivate, className }: SearchTriggerProps) {
  return (
    <SearchField
      readOnly
      value=""
      placeholder="Buscar por nombre o código EAN…"
      aria-label="Buscar por nombre o código EAN"
      aria-haspopup="dialog"
      onFocus={onActivate}
      onClick={onActivate}
      end={<Kbd>{shortcuts.search.key}</Kbd>}
      className={className}
    />
  )
}
