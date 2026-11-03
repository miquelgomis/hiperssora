import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { SectionButtons } from "./section-buttons"

const meta = {
  title: "TPV/Secciones/SectionButtons",
  component: SectionButtons,
  args: { onSelect: fn() },
  argTypes: { sections: { control: false } },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tres botones grandes del panel de cobro (80 px de alto): **Frutería**, **Verdulería** y **Panadería**, para productos sin etiqueta. Cada uno abre `SectionCatalogDialog`. Las secciones y su categoría de Nutriinfo se definen en `src/config/sections.ts`.",
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
} satisfies Meta<typeof SectionButtons>

export default meta
type Story = StoryObj<typeof meta>

/** Botones **Frutería**, **Verdulería** y **Panadería** del panel de cobro. */
export const Default: Story = { name: "Frutería, Verdulería y Panadería" }
