import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Eyebrow } from "./eyebrow"

const meta = {
  title: "Comunes/Eyebrow",
  component: Eyebrow,
  args: {
    children: "Total",
  },
  argTypes: {
    children: { control: "text" },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "**Rótulo** de 12 px en gris, en MAYÚSCULAS por CSS (el texto se escribe en formato de frase). Va sobre un dato o al frente de una columna, y es el **único texto en mayúsculas** del TPV (ver *Fundamentos › Tipografía*).\n\nLo usa la cabecera de columnas del ticket (`TicketColumnsHeader`).",
      },
    },
  },
} satisfies Meta<typeof Eyebrow>

export default meta
type Story = StoryObj<typeof meta>

/** Rótulo suelto. */
export const Default: Story = {}
