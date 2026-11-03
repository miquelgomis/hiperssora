import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { HighlightMatch } from "./highlight-match"

const meta = {
  title: "Comunes/HighlightMatch",
  component: HighlightMatch,
  args: {
    text: "Jamón cocido extra 200 g",
    query: "jam",
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Resalta en rojo, sobre un fondo rojo muy suave, la **primera coincidencia** de lo buscado dentro de un texto. No distingue mayúsculas ni tildes («jamon» encuentra «Jamón»). Sin coincidencia, o con la búsqueda vacía, el texto sale tal cual.\n\nLo usa `ProductLabel` en el nombre y en el EAN de cada resultado del buscador.",
      },
    },
  },
  decorators: [
    (Story) => (
      <p className="text-base font-medium">
        <Story />
      </p>
    ),
  ],
} satisfies Meta<typeof HighlightMatch>

export default meta
type Story = StoryObj<typeof meta>

/** Coincidencia al principio del nombre. */
export const MatchAtStart: Story = {}

/** Fragmento de un código EAN. */
export const MatchInEan: Story = {
  args: { text: "8410012345678", query: "1234" },
  decorators: [
    (Story) => (
      <span className="font-mono text-sm text-muted-foreground">
        <Story />
      </span>
    ),
  ],
}
