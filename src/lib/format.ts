import type { SaleUnit } from "@/types/pos"

const LOCALE = "es-ES"

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
})

const weightFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
})

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
})

const unitSuffix: Record<SaleUnit, string> = {
  unit: "ud",
  kg: "kg",
}

/** 12.5 → "12,50 €" */
export function formatPrice(amount: number): string {
  return currencyFormatter.format(amount)
}

/** 2.29, "kg" → "2,29 €/kg" */
export function formatUnitPrice(price: number, unit: SaleUnit): string {
  return `${formatPrice(price)}/${unitSuffix[unit]}`
}

/** 6, "unit" → "6 ud" · 1.25, "kg" → "1,250 kg" */
export function formatQuantity(quantity: number, unit: SaleUnit): string {
  const value = unit === "kg" ? weightFormatter.format(quantity) : quantity
  return `${value} ${unitSuffix[unit]}`
}

/** Date → "10:32" */
export function formatTime(date: Date): string {
  return timeFormatter.format(date)
}

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  weekday: "long",
  day: "numeric",
  month: "long",
})

/** Date → "lunes, 2 de noviembre" */
export function formatDate(date: Date): string {
  return dateFormatter.format(date)
}

/** Cantidad sin unidad, para el visor del teclado: 16, "unit" → "16" · 1.25, "kg" → "1,250" */
export function formatQuantityValue(quantity: number, unit: SaleUnit): string {
  return unit === "kg" ? weightFormatter.format(quantity) : String(quantity)
}

/** 1 → "1 artículo" · 3 → "3 artículos" */
export function formatItemCount(count: number): string {
  return `${count} ${count === 1 ? "artículo" : "artículos"}`
}
