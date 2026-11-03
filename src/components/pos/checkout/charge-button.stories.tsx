import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { ChargeButton } from "./charge-button"

const meta = {
  title: "TPV/Panel de cobro/ChargeButton",
  component: ChargeButton,
  args: { onCharge: fn() },
  parameters: {
    docs: {
      description: {
        component:
          "**Cobrar**, la acción principal del TPV: el botón más alto del panel de cobro (64 px; 56 px en pantallas bajas), en el rojo de la marca y con su tecla, `F1`. Va justo bajo el total y abre el flujo de pago. Con el ticket vacío está desactivado.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChargeButton>

export default meta
type Story = StoryObj<typeof meta>

/** Con productos en el ticket. */
export const Default: Story = {}

/** Ticket vacío: no hay nada que cobrar. */
export const Disabled: Story = { args: { disabled: true } }
