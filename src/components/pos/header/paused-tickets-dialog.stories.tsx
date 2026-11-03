import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { pausedTickets } from "@/mocks/tickets"

import { PausedTicketsDialog } from "./paused-tickets-dialog"

const meta = {
  title: "TPV/Cabecera/PausedTicketsDialog",
  component: PausedTicketsDialog,
  args: { tickets: pausedTickets, onRestore: fn() },
  parameters: {
    docs: {
      description: {
        component:
          "Botón **Clientes en pausa**. El contador indica las compras aparcadas con *Pausar compra*. Al pulsarlo se abre un **modal** (no un desplegable, por ser una interfaz táctil) con número de ticket, hora, artículos e importe; elegir una compra la restaura en la caja y cierra el modal. Si hay una **compra en curso** (`currentTicket`), se muestra su resumen y cada compra se ofrece como **Pausar actual y recuperar**: un toque pausa la actual y recupera la elegida, sin mezclar dos compras. Sin compras en pausa, el botón está **desactivado**. Al arrancar la app no hay ninguna.",
      },
      story: { inline: false, iframeHeight: 520 },
    },
  },
} satisfies Meta<typeof PausedTicketsDialog>

export default meta
type Story = StoryObj<typeof meta>

/** Botón de la cabecera, cerrado. */
export const Default: Story = {}

/** Modal abierto con las compras en pausa. */
export const Open: Story = {
  args: { defaultOpen: true },
}

/** Hay una compra en curso: recuperar otra la pausa (intercambio en un toque). */
export const WithCurrentTicket: Story = {
  args: { defaultOpen: true, currentTicket: { itemCount: 3, total: 12.4 } },
}

/** Sin compras en pausa: el botón está desactivado (no hay nada que abrir). */
export const Empty: Story = {
  args: { tickets: [] },
}
