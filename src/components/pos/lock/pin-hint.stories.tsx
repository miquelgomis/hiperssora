import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { PinHint } from "./pin-hint"

const meta = {
  title: "TPV/Bloqueo/PinHint",
  component: PinHint,
  parameters: {
    docs: {
      description: {
        component:
          "Mensaje bajo los puntos del PIN en `LockScreen`. Normalmente recuerda que el PIN se teclea en el **teclado físico** de la caja; si el PIN era incorrecto, lo avisa en rojo. Siempre ocupa su línea, así los puntos no saltan al cambiar el mensaje.",
      },
    },
  },
} satisfies Meta<typeof PinHint>

export default meta
type Story = StoryObj<typeof meta>

/** Cómo introducir el PIN. */
export const Default: Story = {}

/** PIN incorrecto. */
export const Error: Story = { args: { hasError: true } }
