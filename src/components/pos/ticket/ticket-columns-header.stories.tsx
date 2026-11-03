import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { TicketColumnsHeader } from "./ticket-columns-header"

const meta = {
  title: "TPV/Ticket/Líneas/TicketColumnsHeader",
  component: TicketColumnsHeader,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Cabecera de columnas del ticket: **Producto**, **Cantidad**, **Precio** y **Total**, con rótulos (`Eyebrow`) sobre una franja gris de 44 px. Comparte la rejilla de las filas (`TICKET_GRID`), así que cada rótulo queda alineado con su columna; las cifras, a la derecha. La columna de la foto ocupa su celda pero su título solo lo lee el lector de pantalla.\n\nVa fija encima de la lista del ticket (`TicketList`).",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-5xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TicketColumnsHeader>

export default meta
type Story = StoryObj<typeof meta>

/** La cabecera sola. */
export const Default: Story = {}
