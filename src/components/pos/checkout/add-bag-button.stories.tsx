import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { AddBagButton } from "./add-bag-button"

const meta = {
  title: "TPV/Panel de cobro/AddBagButton",
  component: AddBagButton,
  args: { price: 0.15, onClick: fn() },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Botón **Bolsa** (`F3`): añade una bolsa al carrito; si ya hay, suma 1. Un **contador** rojo indica cuántas lleva ya la compra, para no dudar de si se añadió. Es secundario: va bajo los botones de sección, que son más grandes.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[26rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AddBagButton>

export default meta
type Story = StoryObj<typeof meta>

/** Sin bolsas en la compra. */
export const Default: Story = { name: "Bolsa" }

/** Con dos bolsas ya añadidas. */
export const WithCount: Story = {
  name: "Bolsa con contador",
  args: { count: 2 },
}
