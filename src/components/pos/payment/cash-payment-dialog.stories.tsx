import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { CashPaymentDialog } from "./cash-payment-dialog"

const meta = {
  title: "TPV/Pago/CashPaymentDialog",
  component: CashPaymentDialog,
  args: {
    open: true,
    total: 34.71,
    amountTendered: 50,
    onAmountTenderedChange: fn(),
    onBack: fn(),
    onConfirm: fn(),
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Cobro en efectivo. Se indica lo entregado (botones rápidos de billetes o *Exacto*) y se muestra el cambio. *Confirmar cobro* solo se activa cuando lo entregado cubre el total.",
      },
      story: { inline: false, iframeHeight: 640 },
    },
  },
} satisfies Meta<typeof CashPaymentDialog>

export default meta
type Story = StoryObj<typeof meta>

/** Entregado mayor que el total: muestra el cambio. */
export const WithChange: Story = {}

/** Entregado insuficiente: muestra lo que falta. */
export const NotEnough: Story = {
  args: { amountTendered: 20 },
}

export const ExactAmount: Story = {
  args: { amountTendered: 34.71 },
}
