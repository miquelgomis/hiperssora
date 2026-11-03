import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { products } from "@/mocks/products"

import { ProductTile } from "./product-tile"

const meta = {
  title: "TPV/Secciones/ProductTile",
  component: ProductTile,
  args: { product: products.platano, onSelect: fn() },
  parameters: {
    docs: {
      description: {
        component:
          "Producto del catálogo de una sección: foto grande (112 px), nombre y precio por kilo (en las secciones solo hay productos sueltos, que se pesan). Toda la tarjeta, de al menos 224 px de alto, es táctil; crece si el nombre ocupa dos líneas. Al tocarla, el producto se añade al ticket.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-48">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductTile>

export default meta
type Story = StoryObj<typeof meta>

/** Sin foto: icono de reserva. */
export const Default: Story = {}

/** Con foto del producto. */
export const WithImage: Story = {
  args: {
    product: {
      ...products.platano,
      imageUrl:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=224&h=224&fit=crop",
    },
  },
}
