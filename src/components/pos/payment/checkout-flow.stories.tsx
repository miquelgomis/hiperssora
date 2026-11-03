import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"

import { CheckoutFlow } from "./checkout-flow"

const meta = {
  title: "TPV/Pago/CheckoutFlow",
  component: CheckoutFlow,
  args: { open: true, total: 34.71, onCancel: fn(), onComplete: fn() },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `**Flujo de cobro completo**, al pulsar **Cobrar**. Es interactivo: pruébalo en el lienzo.

\`\`\`
PaymentMethodDialog ──► Efectivo ──► CashPaymentDialog ──► Confirmar cobro ─┐
        │                                                                   ├──► PaymentCompleteDialog ──► Nueva venta
        └──────────► Tarjeta ──► CardPaymentDialog ──► (2,5 s, aprobado) ───┘
\`\`\`

- **Un solo modal a la vez:** cada paso sustituye al anterior. *Volver* (efectivo) y *Cancelar* (tarjeta) regresan a la forma de pago; *Cancelar* en la forma de pago sale del cobro (\`onCancel\`).
- **Nueva venta** llama a \`onComplete\`, y la app vacía la caja.
- **Maqueta:** el datáfono siempre aprueba a los 2,5 s (\`src/lib/payment-terminal.ts\`).`,
      },
      story: { inline: false, iframeHeight: 680 },
    },
  },
} satisfies Meta<typeof CheckoutFlow>

export default meta
type Story = StoryObj<typeof meta>

/** Empieza en la forma de pago. */
export const Default: Story = {}

/** Efectivo: entrega un billete de 50 €, ver el cambio y terminar. */
export const PayWithCash: Story = {
  play: async ({ args }) => {
    await userEvent.click(
      await screen.findByRole("button", { name: /Efectivo/ })
    )
    await userEvent.click(await screen.findByRole("button", { name: "50 €" }))
    await userEvent.click(
      screen.getByRole("button", { name: "Confirmar cobro" })
    )
    await expect(
      await screen.findByText("Cobro completado")
    ).toBeInTheDocument()
    await expect(screen.getByText("15,29 €")).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Nueva venta" }))
    await expect(args.onComplete).toHaveBeenCalledOnce()
  },
}

/** Tarjeta: el datáfono simulado aprueba solo. */
export const PayWithCard: Story = {
  play: async ({ args }) => {
    await userEvent.click(
      await screen.findByRole("button", { name: /Tarjeta/ })
    )
    await expect(
      await screen.findByText("Esperando al datáfono")
    ).toBeInTheDocument()
    await expect(
      await screen.findByText("Cobro completado", {}, { timeout: 4000 })
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Nueva venta" }))
    await waitFor(() => expect(args.onComplete).toHaveBeenCalledOnce())
  },
}
