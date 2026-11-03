import type { PosAppProps, PosScreenProps } from "@/components/pos/layout"

import { products } from "./products"
import { cashier, pausedTickets, ticketLines } from "./tickets"

/**
 * Datos de la app: el ticket arranca vacío (se llena con el buscador, la pistola o las
 * secciones) y sin compras en pausa.
 */
export const posAppMock: PosAppProps = {
  cashier,
  bagProduct: products.bolsa,
}

/** Pantalla con una compra en curso y dos en pausa, para documentar en Storybook. */
export const posScreenMock: PosScreenProps = {
  ...posAppMock,
  pausedTickets,
  lines: ticketLines,
  selectedLineId: ticketLines[2].id,
  // El visor muestra la cantidad de la línea seleccionada (6 cervezas), como en la app.
  numpad: { value: String(ticketLines[2].quantity) },
}
