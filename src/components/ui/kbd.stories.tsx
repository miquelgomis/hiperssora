import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Kbd } from "./kbd"

const meta = {
  title: "UI/Kbd",
  component: Kbd,
  args: { children: "F2" },
  parameters: {
    docs: {
      description: {
        component:
          "Tecla de shadcn/ui. Indica el atajo de un botón (*Cobrar* F1, secciones F5–F7, buscador F2) y forma `ShortcutHint` en las barras de atajos.",
      },
    },
  },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

/** Una tecla. */
export const Default: Story = {}
