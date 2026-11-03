import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"

import { products } from "@/mocks/products"

import { QuantityDialog } from "./quantity-dialog"

const meta = {
  title: "TPV/Secciones/QuantityDialog",
  component: QuantityDialog,
  args: { product: products.croissant, onBack: fn(), onConfirm: fn() },
  argTypes: { product: { control: false } },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `**Cantidad** de un producto que se vende **por pieza**: la bollería suelta de **Panadería** (croissants, bollitos, empanadas…), que no se pesa. Sustituye al catálogo, como la báscula (nunca hay dos modales a la vez), y empieza en **1**.

- **− / +** (botones de 56 px) cambian la cantidad, entre 1 y 99. Se ve el importe total.
- **Añadir al carrito** añade la línea con esa cantidad y cierra todo; **Volver** regresa al catálogo.
- **Teclado:** los dígitos escriben la cantidad (\`5\` → 5; \`1\` \`2\` → 12), \`+\`/\`−\` suman o restan y \`⌫\` borra. El foco empieza en *Añadir al carrito*, así que \`Enter\` añade. \`←\` \`→\` recorren los botones y \`Esc\` vuelve.`,
      },
      story: { inline: false, iframeHeight: 620 },
    },
  },
} satisfies Meta<typeof QuantityDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Teclear 5 y Enter: 5 croissants. */
export const TypeAndEnter: Story = {
  play: async ({ args }) => {
    const add = await screen.findByRole("button", { name: "Añadir al carrito" })
    await waitFor(() => expect(add).toHaveFocus())
    await userEvent.keyboard("5")
    await expect(
      screen.getByRole("status", { name: "Cantidad" })
    ).toHaveTextContent("5")
    await userEvent.keyboard("{Enter}")
    await expect(args.onConfirm).toHaveBeenCalledWith(products.croissant, 5)
  },
}

/** + y − desde el teclado o los botones; nunca baja de 1. */
export const Stepper: Story = {
  play: async () => {
    const display = await screen.findByRole("status", { name: "Cantidad" })
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Añadir al carrito" })
      ).toHaveFocus()
    )
    await userEvent.keyboard("++")
    await expect(display).toHaveTextContent("3")
    await userEvent.click(screen.getByRole("button", { name: "Restar" }))
    await userEvent.click(screen.getByRole("button", { name: "Restar" }))
    await expect(display).toHaveTextContent("1")
    await expect(screen.getByRole("button", { name: "Restar" })).toBeDisabled()
  },
}
