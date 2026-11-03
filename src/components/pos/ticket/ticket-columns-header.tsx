import { Eyebrow } from "@/components/common"
import { cn } from "@/lib/utils"

import { TICKET_GRID } from "./ticket-grid"

const COLUMNS = [
  { label: "Foto", hidden: true },
  { label: "Producto" },
  { label: "Cantidad", className: "text-right" },
  { label: "Precio", className: "text-right" },
  { label: "Total", className: "text-right" },
]

export type TicketColumnsHeaderProps = {
  className?: string
}

/** Cabecera de columnas del ticket (Producto, Cantidad, Precio, Total), alineada con las filas. */
export function TicketColumnsHeader({ className }: TicketColumnsHeaderProps) {
  return (
    <div
      className={cn(
        TICKET_GRID,
        "h-11 shrink-0 border-b bg-muted/40",
        className
      )}
    >
      {COLUMNS.map((column) =>
        // La columna de la foto ocupa su celda aunque su título solo lo lea el lector de pantalla.
        column.hidden ? (
          <span key={column.label}>
            <span className="sr-only">{column.label}</span>
          </span>
        ) : (
          <Eyebrow key={column.label} className={column.className}>
            {column.label}
          </Eyebrow>
        )
      )}
    </div>
  )
}
