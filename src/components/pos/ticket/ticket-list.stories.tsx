import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { ticketLines } from "@/mocks/tickets"

import { TicketList } from "./ticket-list"

const meta = {
  title: "TPV/Ticket/Líneas/TicketList",
  component: TicketList,
  args: {
    lines: ticketLines,
    selectedLineId: ticketLines[2].id,
    onSelectLine: fn(),
    onChangeQuantity: fn(),
    onRemoveLine: fn(),
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Listado de productos pasados por caja, compuesto por `TicketLineRow`. La línea seleccionada aparece desplegada con su franja de edición. La cabecera de columnas queda fija y las líneas hacen scroll.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex h-[36rem] max-w-5xl flex-col">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TicketList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { className: "flex-1" },
}

/** Caja vacía, a la espera del primer producto. */
export const Empty: Story = {
  args: { lines: [], className: "flex-1" },
}
