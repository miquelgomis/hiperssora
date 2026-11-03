import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Avatar, AvatarFallback } from "./avatar"

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  subcomponents: { AvatarFallback },
  argTypes: { size: { control: "inline-radio", options: ["default", "lg"] } },
  parameters: {
    docs: {
      description: {
        component:
          "Avatar de shadcn/ui con las **iniciales** del cajero (no hay fotos). Lo usan `CashierIdentity` (cabecera), `UserDialog` y `CashierGreeting` (pantalla de bloqueo), que lo amplían con `className`.",
      },
    },
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>MG</AvatarFallback>
    </Avatar>
  ),
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/** Tamaño por defecto, en la cabecera. */
export const Default: Story = {}

/** Grande, en el modal del cajero. */
export const Large: Story = { args: { size: "lg" } }
