import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"

import { PaymentMethodDialog } from "./payment-method-dialog"

const meta = {
  title: "TPV/Pago/PaymentMethodDialog",
  component: PaymentMethodDialog,
  args: { open: true, total: 34.71, onSelect: fn(), onOpenChange: fn() },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Primer paso del cobro, al pulsar **Cobrar** (`F1`). Muestra el total y deja elegir **Tarjeta** (→ `CardPaymentDialog`) o **Efectivo** (→ `CashPaymentDialog`). **Teclado:** el foco empieza en *Tarjeta*; `←` `→` cambian de opción y `Enter` la elige.",
      },
      story: { inline: false, iframeHeight: 560 },
    },
  },
} satisfies Meta<typeof PaymentMethodDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Teclado: → pasa a Efectivo y Enter lo elige. */
export const KeyboardSelection: Story = {
  play: async ({ args }) => {
    const card = await screen.findByRole("button", { name: /Tarjeta/ })
    await waitFor(() => expect(card).toHaveFocus())
    await userEvent.keyboard("{ArrowRight}")
    await expect(screen.getByRole("button", { name: /Efectivo/ })).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(args.onSelect).toHaveBeenCalledWith("cash")
  },
}
