import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Logo } from "./logo"

const meta = {
  title: "Comunes/Logo",
  component: Logo,
  parameters: {
    docs: {
      description: {
        component:
          "Logotipo de Hiperssora. La versión horizontal va en la cabecera del TPV; el isotipo, en espacios reducidos. Los SVG están en `public/brand/`.",
      },
    },
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

/** Logotipo completo. Es la versión de la cabecera. */
export const Horizontal: Story = {}

/** Solo el isotipo, para espacios reducidos. */
export const Mark: Story = {
  args: { variant: "mark" },
}
