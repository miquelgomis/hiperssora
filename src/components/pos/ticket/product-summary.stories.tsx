import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { products } from "@/mocks/products"

import { ProductSummary } from "./product-summary"

const meta = {
  title: "TPV/Ticket/Avisos/ProductSummary",
  component: ProductSummary,
  args: {
    product: products.cerveza,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "**Producto sobre el que actúa un modal**: foto (o icono de reserva), nombre y, si es +18, su distintivo, sobre una caja gris. Lo usa el modal *¿El cliente es mayor de 18 años?* (`AgeVerificationDialog`) para mostrar qué se va a añadir.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductSummary>

export default meta
type Story = StoryObj<typeof meta>

/** Producto +18, como en la verificación de edad. */
export const AgeRestricted: Story = {}

/** Con la foto del producto. */
export const WithImage: Story = {
  args: {
    product: {
      ...products.platano,
      imageUrl:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=96&h=96&fit=crop",
    },
  },
}
