import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { TicketActions } from "./ticket-actions"

const meta = {
  title: "TPV/Panel de cobro/TicketActions",
  component: TicketActions,
  args: { onPause: fn(), onClear: fn() },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Acciones secundarias sobre la **compra entera**, justo debajo de *Cobrar*, con el mismo estilo entre sí (con borde; *Anular* en rojo) y mucho más discretas que *Cobrar*: **Pausar compra** (`F4`, abre `PauseTicketDialog`) y **Anular compra** (abre `ClearTicketDialog`). Con el ticket vacío, se desactivan.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[26rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TicketActions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: "Pausar y Anular compra" }

/** Ticket vacío. */
export const Disabled: Story = { args: { disabled: true } }
