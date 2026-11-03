import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { SearchTrigger } from "./search-trigger"

const meta = {
  title: "TPV/Ticket/Buscador/SearchTrigger",
  component: SearchTrigger,
  args: { onActivate: fn() },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Buscador de la pantalla principal. Es **el mismo `SearchField`** (variante `bar`) que hay dentro del modal de búsqueda, así que se ven y miden exactamente igual; aquí es de solo lectura y muestra su tecla, `F2`. En cuanto recibe el foco (toque, clic, `Tab` o `F2`) llama a `onActivate`, que abre `ProductSearchDialog`, donde se escribe.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchTrigger>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
