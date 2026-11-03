/** Forma de venta de un producto: por unidades o al peso. */
export type SaleUnit = "unit" | "kg"

export type Product = {
  id: string
  /** Nombre visible. Si hay formato, va al final: "Calabacín blanco · Pieza". */
  name: string
  /** Formato de venta ("Pieza", "Bandeja", "Pack-6"…), si lo hay. */
  format?: string
  /** Código de barras EAN-13. Los productos al peso usan códigos internos (prefijo 2). */
  ean: string
  /** Precio por unidad o por kilo, según `unit`. */
  price: number
  unit: SaleUnit
  /** Venta solo a mayores de 18 años (bebidas alcohólicas). */
  ageRestricted?: boolean
  /** Precio por kilo de referencia, para venderlo pesado en báscula. */
  pricePerKg?: number
  categoryId: string
  imageUrl?: string
}

/** Una línea del ticket: un producto y la cantidad (unidades o kilos). */
export type TicketLine = {
  id: string
  product: Product
  quantity: number
}

/** Compra aparcada a la espera de que el cliente vuelva. */
export type PausedTicket = {
  id: string
  /** Número de ticket visible para el cajero. */
  number: string
  pausedAt: Date
  lines: TicketLine[]
}

export type Cashier = {
  name: string
  /** Número de caja registradora. */
  register: number
}

export type KeyboardShortcut = {
  /** Tecla tal y como se muestra: "Esc", "F1", "↑"… */
  key: string
  label: string
  /** Valor de `KeyboardEvent.key` que la activa: "Escape", "F1", "ArrowUp"… */
  eventKey: string
}

/** Resumen de la compra en curso, para mostrarlo sin pasar todas sus líneas. */
export type TicketSummary = {
  itemCount: number
  total: number
}

export type PaymentMethod = "card" | "cash"

/** Estado de la última lectura con la pistola: buscando, no encontrado o error. */
export type ScanStatus = {
  state: "searching" | "not-found" | "error"
  ean: string
}
