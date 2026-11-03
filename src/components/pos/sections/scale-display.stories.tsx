import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { ScaleDisplay } from "./scale-display"

const meta = {
  title: "TPV/Secciones/ScaleDisplay",
  component: ScaleDisplay,
  args: { weight: 1.234, onReweigh: fn() },
  parameters: {
    docs: {
      description: {
        component:
          "Visor de la báscula, dentro de `ScaleDialog`. **Pesando:** borde discontinuo, *Pesando…* con un indicador y la cifra en gris, latiendo; *Volver a pesar* desactivado. **Peso estable:** el peso en grande (cifra protagonista, 48 px) sobre el color de la marca y *Volver a pesar* activo, por si la lectura no es correcta.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScaleDisplay>

export default meta
type Story = StoryObj<typeof meta>

/** Peso estable: listo para añadir. */
export const Weighed: Story = {}

/** La báscula todavía está pesando. */
export const Weighing: Story = { args: { weight: null } }
