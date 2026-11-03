import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { KeyRound, Scale } from "lucide-react"

import { MockupNote } from "./mockup-note"

const meta = {
  title: "Comunes/MockupNote",
  component: MockupNote,
  args: {
    icon: KeyRound,
    children: "el PIN es 1111.",
  },
  argTypes: {
    icon: { control: false },
    children: { control: "text" },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Aviso de **maqueta**: una píldora gris que empieza por *Maqueta:* y explica lo que está simulado para quien prueba la interfaz, como el PIN de la pantalla de bloqueo (`1111`) o la báscula. El icono es opcional. Desaparecerá cuando haya backend y dispositivos reales.",
      },
    },
  },
} satisfies Meta<typeof MockupNote>

export default meta
type Story = StoryObj<typeof meta>

/** PIN de la pantalla de bloqueo. */
export const Pin: Story = {}

/** Báscula simulada. */
export const ScaleSimulation: Story = {
  args: {
    icon: Scale,
    children: "la báscula da un peso aleatorio entre 0,5 y 1,5 kg.",
  },
}
