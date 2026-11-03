import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PinIndicator } from "./pin-indicator"

const meta = {
  title: "TPV/Bloqueo/PinIndicator",
  component: PinIndicator,
  args: { filled: 2, length: 4 },
  argTypes: {
    filled: { control: { type: "range", min: 0, max: 4 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Puntos que indican cuántos dígitos del PIN se han tecleado, sin mostrarlos. Con `error` se marcan en rojo y con `success`, en verde, justo antes de desbloquear.",
      },
    },
  },
} satisfies Meta<typeof PinIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = { args: { filled: 0 } }

export const Partial: Story = {}

export const Complete: Story = { args: { filled: 4 } }

/** PIN incorrecto. */
export const Error: Story = { args: { filled: 4, error: true } }

/** PIN correcto, antes de la animación de salida. */
export const Success: Story = { args: { filled: 4, success: true } }
