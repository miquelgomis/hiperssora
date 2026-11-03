import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { CountBadge } from "./count-badge"

const meta = {
  title: "Comunes/CountBadge",
  component: CountBadge,
  args: {
    count: 2,
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "**Contador redondo** junto a un botón: las compras en pausa de *Clientes en pausa* (barra superior) o las bolsas que ya lleva la compra (*Bolsa*, en el panel de cobro). En **rojo** cuando hay algo que contar y en **gris** con cero. Las cifras son tabulares y el círculo crece con números de dos cifras.",
      },
    },
  },
} satisfies Meta<typeof CountBadge>

export default meta
type Story = StoryObj<typeof meta>

/** Con algo que contar: en rojo. */
export const WithCount: Story = {}

/** Con cero: en gris. */
export const Zero: Story = {
  args: { count: 0 },
}
