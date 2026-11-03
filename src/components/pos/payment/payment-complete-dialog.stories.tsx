import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { PaymentCompleteDialog } from "./payment-complete-dialog"

const meta = {
  title: "TPV/Pago/PaymentCompleteDialog",
  component: PaymentCompleteDialog,
  args: {
    open: true,
    total: 34.71,
    method: "cash",
    change: 15.29,
    onNewSale: fn(),
  },
  argTypes: {
    method: { control: "inline-radio", options: ["cash", "card"] },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Último paso del cobro, común a efectivo y tarjeta. Confirma el pago y, en efectivo, muestra en grande el **cambio a devolver**. **Nueva venta**, ya enfocado, cierra el cobro y deja la caja vacía para el siguiente cliente.",
      },
      story: { inline: false, iframeHeight: 560 },
    },
  },
} satisfies Meta<typeof PaymentCompleteDialog>

export default meta
type Story = StoryObj<typeof meta>

/** Efectivo, con cambio a devolver. */
export const Cash: Story = {}

/** Tarjeta. */
export const Card: Story = {
  args: { method: "card", change: 0 },
}
