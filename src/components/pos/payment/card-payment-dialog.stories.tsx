import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { CardPaymentDialog } from "./card-payment-dialog"

const meta = {
  title: "TPV/Pago/CardPaymentDialog",
  component: CardPaymentDialog,
  args: {
    open: true,
    total: 34.71,
    status: "waiting",
    onCancel: fn(),
    onRetry: fn(),
  },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["waiting", "declined"],
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Cobro con tarjeta. Refleja el estado del datáfono: **esperando** la tarjeta o **rechazado** (reintentar o cambiar de forma de pago). Si se aprueba, el flujo pasa a `PaymentCompleteDialog`. **Maqueta:** en la app, el datáfono simulado siempre aprueba a los 2,5 s.",
      },
      story: { inline: false, iframeHeight: 520 },
    },
  },
} satisfies Meta<typeof CardPaymentDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Waiting: Story = {}

export const Declined: Story = {
  args: { status: "declined" },
}
