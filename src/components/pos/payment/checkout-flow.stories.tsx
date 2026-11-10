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
        └──────────► Tarjeta ──► CardPaymentDialog ──► (datáfono aprueba) ──┘
\`\`\`

- **Un solo modal a la vez:** cada paso sustituye al anterior. *Volver* (efectivo) y *Cancelar* (tarjeta) regresan a la forma de pago; *Cancelar* en la forma de pago sale del cobro (\`onCancel\`).
- **Nueva venta** llama a \`onComplete\`, y la app vacía la caja.
- **Es solo interfaz, no habla con el datáfono.** El paso actual (\`step\`) se puede controlar desde fuera: en el paso de tarjeta espera a que quien lo controla lo pase a \`complete\`. En la app lo hace \`PosApp\` con el hook \`useCheckout\`, cuyo datáfono simulado aprueba a los 2,5 s (\`src/lib/payment-terminal.ts\`).`,
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

/** Tarjeta: espera al datáfono y avisa del cambio de paso con `onStepChange`. */
export const PayWithCard: Story = {
  args: { onStepChange: fn() },
  play: async ({ args }) => {
    await userEvent.click(
      await screen.findByRole("button", { name: /Tarjeta/ })
    )
    await expect(args.onStepChange).toHaveBeenCalledWith({ name: "card" })
    await expect(
      await screen.findByText("Esperando al datáfono")
    ).toBeInTheDocument()
  },
}

/** Pago con tarjeta aprobado: *Nueva venta* termina el cobro. */
export const CardApproved: Story = {
  args: { defaultStep: { name: "complete", method: "card", change: 0 } },
  play: async ({ args }) => {
    await expect(
      await screen.findByText("Cobro completado")
    ).toBeInTheDocument()
    await userEvent.click(screen.getByRole("button", { name: "Nueva venta" }))
    await waitFor(() => expect(args.onComplete).toHaveBeenCalledOnce())
  },
}
