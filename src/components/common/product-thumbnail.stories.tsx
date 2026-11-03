import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ProductThumbnail } from "./product-thumbnail"

const meta = {
  title: "Comunes/ProductThumbnail",
  component: ProductThumbnail,
  args: { alt: "Plátano de Canarias", size: "md" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Miniatura de producto. `sm` y `md` en el buscador y el ticket, y `xl` en los catálogos de sección. Si el producto no tiene foto, muestra un icono neutro.",
      },
    },
  },
} satisfies Meta<typeof ProductThumbnail>

export default meta
type Story = StoryObj<typeof meta>

/** Sin foto: icono de reserva. */
export const Fallback: Story = {}

/** Con foto del producto. */
export const WithImage: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=128&h=128&fit=crop",
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-end gap-4">
      <ProductThumbnail {...args} size="sm" />
      <ProductThumbnail {...args} size="md" />
      <ProductThumbnail {...args} size="lg" />
      <ProductThumbnail {...args} size="xl" />
    </div>
  ),
}
