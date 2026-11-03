import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Badge } from "./badge"

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: { children: "2" },
  argTypes: {
    variant: { control: "inline-radio", options: ["default", "secondary"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Distintivo de shadcn/ui. En el TPV solo se usa a través de `CountBadge` (contador de compras en pausa y de bolsas): rojo (`default`) con algo que contar y gris (`secondary`) con cero.",
      },
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/** En rojo: hay algo que contar. */
export const Default: Story = {}

/** En gris: cero. */
export const Secondary: Story = {
  args: { variant: "secondary", children: "0" },
}
