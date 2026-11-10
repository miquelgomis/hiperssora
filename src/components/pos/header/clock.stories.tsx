import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { mockDate } from "@/mocks/tickets"

import { Clock } from "./clock"

const meta = {
  title: "TPV/Cabecera/Clock",
  component: Clock,
  args: { date: mockDate },
  parameters: {
    docs: {
      description: {
        component:
          "Hora y fecha de la caja, en la cabecera. Es solo interfaz: muestra la fecha que recibe en `date`. En la app, `PosApp` le pasa la hora real y la actualiza cada minuto (hook `useNow`).",
      },
    },
  },
} satisfies Meta<typeof Clock>

export default meta
type Story = StoryObj<typeof meta>

/** Con una fecha y hora. */
export const Default: Story = {}

/** Sin fecha todavía (servidor, antes de hidratar): `--:--`. */
export const Unknown: Story = {
  args: { date: null },
}
