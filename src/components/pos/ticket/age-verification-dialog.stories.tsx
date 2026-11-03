import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"

import { products } from "@/mocks/products"

import { AgeVerificationDialog } from "./age-verification-dialog"

const meta = {
  title: "TPV/Ticket/Avisos/AgeVerificationDialog",
  component: AgeVerificationDialog,
  args: { product: products.cerveza, onConfirm: fn(), onCancel: fn() },
  argTypes: { product: { control: false } },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `**Verificación de edad.** Aparece al añadir el **primer producto +18** de la compra, por cualquier vía: buscador, pistola o sección.

- **Sí, es mayor de 18**: el producto se añade y la compra queda **verificada**, así que los siguientes productos +18 entran sin preguntar. Al pausar o recuperar una compra, se mantiene si ya tenía productos +18.
- **No, no añadir**: el producto no entra en el ticket.

**Qué es +18:** bebidas con más de **1,2 % vol**, según el campo \`graduacion_alcohol\` de Nutriinfo (\`ageRestricted\` en \`Product\`). Las cervezas 0,0 no lo son. En el ticket y en el buscador llevan el distintivo \`AgeBadge\`.`,
      },
      story: { inline: false, iframeHeight: 560 },
    },
  },
} satisfies Meta<typeof AgeVerificationDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: "Mayor de 18 años" }

/** Con un nombre largo, como los de Nutriinfo: se corta con puntos suspensivos sin desbordar el modal. */
export const LongName: Story = {
  args: {
    product: {
      ...products.cerveza,
      name: "Cerveza especial tostada sin filtrar Mahou Maestra Doble Lúpulo · Pack-12 latas 33 cl",
    },
  },
}

/** Al abrirse, el foco está en *Sí, es mayor de 18*: `Enter` lo añade. */
export const EnterConfirms: Story = {
  play: async ({ args }) => {
    const confirm = await screen.findByRole("button", {
      name: "Sí, es mayor de 18",
    })
    await waitFor(() => expect(confirm).toHaveFocus())
    await userEvent.keyboard("{Enter}")
    await expect(args.onConfirm).toHaveBeenCalledOnce()
  },
}
