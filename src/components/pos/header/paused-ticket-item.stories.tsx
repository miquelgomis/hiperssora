import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { pausedTickets } from "@/mocks/tickets"

import { PausedTicketItem } from "./paused-ticket-item"

const meta = {
  title: "TPV/Cabecera/PausedTicketItem",
  component: PausedTicketItem,
  args: { ticket: pausedTickets[0], onClick: fn() },
  argTypes: { ticket: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "Compra en pausa en el modal *Clientes en pausa* (`PausedTicketsDialog`): número de ticket, desde qué hora espera y cuántos artículos lleva, el importe y la acción. Sin compra en curso, un toque la **recupera**; con una compra en curso, la acción es **Pausar actual y recuperar** (intercambio en un toque). Es un `OptionCard` de 80 px de alto.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PausedTicketItem>

export default meta
type Story = StoryObj<typeof meta>

/** Caja libre: un toque la recupera. */
export const Restore: Story = {}

/** Con una compra en curso: la pausa y recupera esta. */
export const Swap: Story = { args: { swaps: true } }
