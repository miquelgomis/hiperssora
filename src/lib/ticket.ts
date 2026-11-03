import { LOOSE_BREAD_CATEGORY_IDS } from "@/config/sections"
import type { Product, TicketLine } from "@/types/pos"

/** Importe de una línea, redondeado a céntimos. */
export function getLineTotal(line: TicketLine): number {
  return Math.round(line.product.price * line.quantity * 100) / 100
}

export function getTicketTotal(lines: TicketLine[]): number {
  return lines.reduce((total, line) => total + getLineTotal(line), 0)
}

/** Número de artículos: cada unidad cuenta 1 y cada producto al peso cuenta 1. */
export function getItemCount(lines: TicketLine[]): number {
  return lines.reduce(
    (count, line) => count + (line.product.unit === "unit" ? line.quantity : 1),
    0
  )
}

/**
 * Añade un producto al ticket. Si ya está, suma la cantidad a su línea; si no, lo encola al
 * final con una línea nueva. Devuelve las líneas nuevas y el id de la línea afectada.
 */
export function addToTicket(
  lines: TicketLine[],
  product: Product,
  quantity = 1
): { lines: TicketLine[]; lineId: string } {
  // Un mismo producto vendido por unidades y pesado son líneas distintas.
  const existing = lines.find(
    (line) =>
      line.product.id === product.id && line.product.unit === product.unit
  )
  if (existing) {
    return {
      lines: lines.map((line) =>
        line.id === existing.id
          ? { ...line, quantity: line.quantity + quantity }
          : line
      ),
      lineId: existing.id,
    }
  }

  const line: TicketLine = { id: crypto.randomUUID(), product, quantity }
  return { lines: [...lines, line], lineId: line.id }
}

/**
 * Línea del ticket con ese código de barras, vendida por unidades. Las pesadas no cuentan: volver
 * a escanear un producto no debe sumarle 1 kg.
 */
export function findLineByEan(
  lines: TicketLine[],
  ean: string
): TicketLine | undefined {
  return lines.find(
    (line) => line.product.ean === ean && line.product.unit === "unit"
  )
}

/**
 * Versión del producto para venderlo al peso: unidad `kg`, precio por kilo y sin el formato
 * en el nombre ("Calabacín blanco · Pieza" → "Calabacín blanco"), que ya no aplica.
 */
export function toWeighedProduct(product: Product): Product {
  if (product.unit === "kg") return product
  return {
    ...withoutFormat(product),
    unit: "kg",
    price: product.pricePerKg ?? product.price,
  }
}

/** Quita el formato del nombre ("Croissant · Pieza" → "Croissant"), cuando ya no aporta. */
export function withoutFormat(product: Product): Product {
  if (!product.format) return product
  return {
    ...product,
    name: product.name.replace(` · ${product.format}`, ""),
    format: undefined,
  }
}

/** Paso de los botones − / +: 1 unidad o 100 g. */
export function getQuantityStep(unit: Product["unit"]): number {
  return unit === "kg" ? 0.1 : 1
}

/** Cambia la cantidad de una línea (redondeada al gramo en productos al peso). */
export function setLineQuantity(
  lines: TicketLine[],
  lineId: string,
  quantity: number
): TicketLine[] {
  return lines.map((line) =>
    line.id === lineId
      ? { ...line, quantity: Math.round(quantity * 1000) / 1000 }
      : line
  )
}

export function removeLine(lines: TicketLine[], lineId: string): TicketLine[] {
  return lines.filter((line) => line.id !== lineId)
}

/**
 * Formatos que se venden sueltos (y en fruta y verdura, se pesan en la báscula). El resto (bandeja, tarrina, vaso,
 * malla, bolsa, paquete…, o sin formato) son envases que se cobran por paquete. Nutriinfo
 * marca `es_granel` también en envases de peso variable, así que no sirve para esto.
 */
const LOOSE_FORMATS = new Set(["Pieza", "1/2 Pieza", "Granel"])

/**
 * El producto se vende suelto, sin código de barras propio: banana · Pieza o una barra de pan,
 * sí; arándanos · Tarrina o «3 Barras de pan», no. Se elige en su sección (y se pesa o se
 * cuenta), no en el buscador.
 */
export function isSoldLoose(product: Product): boolean {
  if (product.unit === "kg") return true
  if (product.format) return LOOSE_FORMATS.has(product.format)
  // Sin formato, solo el pan de horno suelto (los packs empiezan por un número).
  return (
    LOOSE_BREAD_CATEGORY_IDS.has(product.categoryId) &&
    !/^\d/.test(product.name)
  )
}
