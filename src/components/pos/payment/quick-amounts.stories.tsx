import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { QuickAmounts } from "./quick-amounts"

const meta = {
  title: "TPV/Pago/QuickAmounts",
  component: QuickAmounts,
  args: { total: 23.45, onSelect: fn() },
  parameters: {
    docs: {
      description: {
        component:
          "Importes rápidos del pago en efectivo (`CashPaymentDialog`): *Exacto* (el total) y los billetes de 5, 10, 20 y 50 €, en botones de 56 px. Las flechas los recorren.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof QuickAmounts>

export default meta
type Story = StoryObj<typeof meta>

/** Billetes y *Exacto*. */
export const Default: Story = {}
