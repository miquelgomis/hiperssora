import type { PausedTicket, TicketLine } from "@/types/pos"

import { products } from "./products"

export const ticketLines: TicketLine[] = [
  { id: "l1", product: products.jamon, quantity: 1 },
  { id: "l2", product: products.aceite, quantity: 1 },
  { id: "l3", product: products.cerveza, quantity: 6 },
  { id: "l4", product: products.platano, quantity: 1.25 },
  { id: "l5", product: products.leche, quantity: 3 },
  { id: "l6", product: products.tomate, quantity: 0.85 },
  { id: "l7", product: products.barra, quantity: 2 },
  { id: "l8", product: products.huevos, quantity: 1 },
  { id: "l9", product: products.bolsa, quantity: 2 },
]

export const pausedTickets: PausedTicket[] = [
  {
    id: "p1",
    number: "0041",
    pausedAt: new Date("2026-11-02T10:32:00"),
    lines: [
      { id: "p1-1", product: products.leche, quantity: 6 },
      { id: "p1-2", product: products.huevos, quantity: 1 },
    ],
  },
  {
    id: "p2",
    number: "0043",
    pausedAt: new Date("2026-11-02T10:47:00"),
    lines: [
      { id: "p2-1", product: products.aceite, quantity: 2 },
      { id: "p2-2", product: products.patata, quantity: 1.5 },
      { id: "p2-3", product: products.bolsa, quantity: 1 },
    ],
  },
]

/** Fecha fija para que el reloj no cambie entre capturas de Storybook. */
export const mockDate = new Date("2026-11-02T11:05:00")
