/**
 * Columnas compartidas por la cabecera y las filas del ticket:
 * foto · producto (nombre + EAN) · cantidad · precio unitario · total.
 */
export const TICKET_GRID =
  "grid grid-cols-[3rem_minmax(0,1fr)_8rem_8rem_8rem] items-center gap-4 px-6"

/** Sangría que alinea contenido bajo el nombre: px-6 (24) + foto (48) + separación (16). */
export const TICKET_NAME_INDENT = "pl-22"
