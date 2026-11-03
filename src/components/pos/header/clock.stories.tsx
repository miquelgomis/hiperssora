import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Clock } from "./clock"

const meta = {
  title: "TPV/Cabecera/Clock",
  component: Clock,
  parameters: {
    docs: {
      description: {
        component:
          "Hora y fecha de la caja, en la cabecera. Sin `date` muestra la hora real y se actualiza cada minuto (hook `useNow`).",
      },
    },
  },
} satisfies Meta<typeof Clock>

export default meta
type Story = StoryObj<typeof meta>

/** Hora real, actualizándose. */
export const Live: Story = {}
