import type { PosAppProps, PosScreenProps } from "@/components/pos/layout"

import { cashier } from "@/config/auth"
import { bagProduct } from "@/config/products"

import { pausedTickets, ticketLines } from "./tickets"

/** La app tal cual arranca: ticket vacío y sin compras en pausa. */
export const posAppMock: PosAppProps = {
  cashier,
  bagProduct,
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
