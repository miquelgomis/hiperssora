import type { Product, TicketLine } from "@/types/pos"

import { ProductSearch, type ProductSearchState } from "./product-search"
import { TicketList } from "./ticket-list"

export type TicketPanelProps = {
  lines: TicketLine[]
  /** Estado del buscador: texto, resultados, carga y error. */
  search?: ProductSearchState
  selectedLineId?: string
  /** Producto elegido en el buscador. */
  onAddProduct?: (product: Product) => void
  onSelectLine?: (lineId: string) => void
  onChangeQuantity?: (lineId: string, quantity: number) => void
  onRemoveLine?: (lineId: string) => void
  /** Confirmación de eliminar la línea seleccionada (control externo). */
  confirmingRemoval?: boolean
  onConfirmingRemovalChange?: (confirming: boolean) => void
  /** Modal de búsqueda abierto (control externo, p. ej., con F2). */
  searchOpen?: boolean
  onSearchOpenChange?: (open: boolean) => void
}

/**
 * Columna izquierda del TPV, de borde a borde: el buscador arriba, fijo, y el listado del
 * ticket ocupando todo el resto, con su propio scroll.
 */
export function TicketPanel({
  lines,
  search,
  selectedLineId,
  onAddProduct,
  onSelectLine,
  onChangeQuantity,
  onRemoveLine,
  confirmingRemoval,
  onConfirmingRemovalChange,
  searchOpen,
  onSearchOpenChange,
}: TicketPanelProps) {
  return (
    <section aria-label="Ticket" className="flex h-full min-h-0 flex-col">
      <ProductSearch
        {...search}
        onSelect={onAddProduct}
        open={searchOpen}
        onOpenChange={onSearchOpenChange}
      />
      <TicketList
        lines={lines}
        selectedLineId={selectedLineId}
        onSelectLine={onSelectLine}
        onChangeQuantity={onChangeQuantity}
        onRemoveLine={onRemoveLine}
        confirmingRemoval={confirmingRemoval}
        onConfirmingRemovalChange={onConfirmingRemovalChange}
        className="flex-1"
      />
    </section>
  )
}
