import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Separator } from "./separator"

const meta = {
  title: "UI/Separator",
  component: Separator,
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
  parameters: {
    docs: {
      description: {
        component: "Línea divisoria fina para separar grupos de contenido.",
      },
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-64 space-y-3 text-sm">
      <p>Total</p>
      <Separator {...args} />
      <p>Teclado numérico</p>
    </div>
  ),
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-10 items-center gap-4 text-sm">
      <span>11:05</span>
      <Separator {...args} />
      <span>Clientes en pausa</span>
    </div>
  ),
}
