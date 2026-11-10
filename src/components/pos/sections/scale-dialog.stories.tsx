import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"

import { toWeighedProduct } from "@/lib/ticket"
import { products } from "@/mocks/products"

import { ScaleDialog } from "./scale-dialog"

const meta = {
  title: "TPV/Secciones/ScaleDialog",
  component: ScaleDialog,
  args: {
    product: products.manzana,
    weight: 1.234,
    mockupNote: "báscula simulada con un peso aleatorio entre 0,5 y 1,5 kg",
    onReweigh: fn(),
    onBack: fn(),
    onConfirm: fn(),
  },
  argTypes: {
    product: { control: false },
    weight: { control: { type: "number", min: 0.5, max: 1.5, step: 0.001 } },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `**Báscula** de la caja. Sustituye al catálogo (nunca hay dos modales a la vez) al elegir un producto de Frutería, Verdulería o Panadería, que se venden al peso.

1. **Pesando…** (\`weight: null\`): el visor parpadea y *Añadir al carrito* está desactivado.
2. **Peso estable**: muestra el peso, el precio por kilo y el importe. Al lado del peso, **Volver a pesar** (\`onReweigh\`) repite la lectura si ha habido un error, por ejemplo si el producto no estaba bien colocado.
3. El cajero confirma con **Añadir al carrito** (\`onConfirm(product, weight)\`) o pulsa **Volver** para regresar al catálogo.

**Teclado:** mientras pesa, \`Enter\` no hace nada (para que un \`Enter\` impaciente no pulse *Volver*); cuando el peso se estabiliza, el foco pasa a *Añadir al carrito*, así que \`Enter\` añade; \`←\` \`→\` recorren los botones y \`Esc\` vuelve al catálogo.

**Es solo interfaz, no lee la báscula.** Muestra el \`weight\` que recibe y avisa con \`onReweigh\`. En la app, \`PosApp\` lee la báscula con el hook \`useScale\`. En la maqueta es simulada (\`src/lib/scale.ts\`): da un peso aleatorio entre 0,5 y 1,5 kg tras 1,2 s, y la app lo avisa con \`mockupNote\`. Es el único punto que cambiará al conectar una báscula de verdad.

El producto llega en su versión al peso (\`toWeighedProduct\`): unidad \`kg\`, precio por kilo de Nutriinfo y **sin el formato en el nombre** (\`Calabacín blanco · Pieza\` → \`Calabacín blanco\`), aunque en tienda se venda por pieza.`,
      },
      story: { inline: false, iframeHeight: 680 },
    },
  },
} satisfies Meta<typeof ScaleDialog>

export default meta
type Story = StoryObj<typeof meta>

/** Peso estable, listo para añadir. */
export const Weighed: Story = {}

/** La báscula aún está pesando: *Volver a pesar* y *Añadir al carrito* están desactivados. */
export const Weighing: Story = {
  args: { weight: null },
}

/** Producto que se vende por pieza en tienda, pesado a su precio por kilo. */
export const BreadByWeight: Story = {
  args: { product: toWeighedProduct(products.barra), weight: 0.62 },
}

/** Con el peso estable, Enter añade al carrito (el foco ya está en ese botón). */
export const EnterAddsToCart: Story = {
  play: async ({ args }) => {
    const add = await screen.findByRole("button", { name: "Añadir al carrito" })
    await waitFor(() => expect(add).toHaveFocus())
    await userEvent.keyboard("{Enter}")
    await expect(args.onConfirm).toHaveBeenCalledWith(args.product, 1.234)
  },
}

/** Mientras pesa, Enter no hace nada. */
export const EnterWhileWeighing: Story = {
  args: { weight: null },
  play: async ({ args }) => {
    await screen.findByText("Pesando…")
    await userEvent.keyboard("{Enter}")
    await expect(args.onBack).not.toHaveBeenCalled()
    await expect(args.onConfirm).not.toHaveBeenCalled()
  },
}

/**
 * Producto que en tienda se vende por pieza («Calabacín blanco · Pieza»): al pesarlo se quita
 * el formato del nombre y se cobra a su precio por kilo.
 */
export const FromPiece: Story = {
  args: {
    product: toWeighedProduct({
      id: "calabacin",
      name: "Calabacín blanco · Pieza",
      format: "Pieza",
      ean: "2000140000007",
      price: 0.62,
      unit: "unit",
      pricePerKg: 1.79,
      categoryId: "verduleria",
    }),
    weight: 0.7,
  },
  play: async () => {
    await expect(
      await screen.findByRole("heading", { name: "Calabacín blanco" })
    ).toBeInTheDocument()
    await expect(screen.getByText("1,79 €/kg")).toBeInTheDocument()
  },
}
