import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { AgeBadge } from "./age-badge"

const meta = {
  title: "Comunes/AgeBadge",
  component: AgeBadge,
  parameters: {
    docs: {
      description: {
        component:
          "Distintivo **+18** junto al nombre de los productos con venta restringida a mayores de edad: bebidas con más de 1,2 % vol, según `graduacion_alcohol` de Nutriinfo. Aparece en el ticket y en el buscador.",
      },
    },
  },
} satisfies Meta<typeof AgeBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Junto al nombre de un producto, como en el ticket. */
export const NextToName: Story = {
  render: () => (
    <span className="flex items-center gap-2 text-base font-medium">
      Cerveza Amstel · Lata <AgeBadge />
    </span>
  ),
}
