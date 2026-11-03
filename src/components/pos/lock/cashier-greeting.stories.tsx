import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { cashier } from "@/mocks/tickets"

import { CashierGreeting } from "./cashier-greeting"

const meta = {
  title: "TPV/Bloqueo/CashierGreeting",
  component: CashierGreeting,
  args: { cashier, variant: "welcome" },
  argTypes: {
    variant: { control: "inline-radio", options: ["welcome", "locked"] },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Saludo de `LockScreen`: avatar grande con las iniciales, título de pantalla, qué hacer y el número de caja. **Bienvenida** (`welcome`) al empezar el turno o tras cerrar sesión: *Hola, Miquel*. **Bloqueada** (`locked`) tras *Bloquear pantalla*.",
      },
    },
  },
} satisfies Meta<typeof CashierGreeting>

export default meta
type Story = StoryObj<typeof meta>

/** Inicio de turno. */
export const Welcome: Story = {}

/** Pantalla bloqueada por el cajero. */
export const Locked: Story = { args: { variant: "locked" } }
