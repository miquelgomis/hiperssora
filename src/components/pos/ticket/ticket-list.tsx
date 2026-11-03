import { ScanBarcode } from "lucide-react"

import { EmptyState } from "@/components/common"
import { cn } from "@/lib/utils"
import type { TicketLine } from "@/types/pos"

import { TicketColumnsHeader } from "./ticket-columns-header"
import { TicketLineRow } from "./ticket-line-row"

export type TicketListProps = {
  lines: TicketLine[]
  selectedLineId?: string
  onSelectLine?: (lineId: string) => void
  onChangeQuantity?: (lineId: string, quantity: number) => void
  onRemoveLine?: (lineId: string) => void
  /** La línea seleccionada está pidiendo confirmación para eliminarse. */
  confirmingRemoval?: boolean
  onConfirmingRemovalChange?: (confirming: boolean) => void
  className?: string
}

/**
 * Listado de productos pasados por caja, de borde a borde y sin caja alrededor. La cabecera de
 * columnas queda fija y las líneas ocupan el resto, con su propio scroll. Sin líneas, muestra
 * un estado vacío.
 */
export function TicketList({
  lines,
  selectedLineId,
  onSelectLine,
  onChangeQuantity,
  onRemoveLine,
  confirmingRemoval,
  onConfirmingRemovalChange,
  className,
}: TicketListProps) {
  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <TicketColumnsHeader />

      {lines.length === 0 ? (
        <EmptyState
          icon={ScanBarcode}
          title="Escanea o busca un producto para empezar"
          description="Con la pistola, el buscador (F2) o las secciones"
          className="flex-1"
        />
      ) : (
        <ul
          aria-label="Productos del ticket"
          // 80 px de aire al final; scroll-pb hace que el desplazamiento automático a la línea
          // recién añadida también lo respete.
          className="min-h-0 flex-1 scroll-pb-20 overflow-y-auto pb-20"
        >
          {lines.map((line) => (
            <TicketLineRow
              key={line.id}
              line={line}
              selected={line.id === selectedLineId}
              onSelect={onSelectLine}
              onChangeQuantity={onChangeQuantity}
              onRemove={onRemoveLine}
              {...(line.id === selectedLineId && {
                confirmingRemoval,
                onConfirmingRemovalChange,
              })}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
