import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { cashier } from "@/mocks/tickets"

import { CashierIdentity } from "./cashier-identity"

const meta = {
  title: "TPV/Cabecera/CashierIdentity",
  component: CashierIdentity,
  args: { cashier },
  parameters: {
    docs: {
      description: {
        component:
          "Quién está en la caja: avatar con sus iniciales, nombre y, debajo en gris, el número de caja. Es el contenido del botón del cajero (`UserDialog`) en la cabecera.",
      },
    },
  },
} satisfies Meta<typeof CashierIdentity>

export default meta
type Story = StoryObj<typeof meta>

/** Cajero y caja. */
export const Default: Story = {}
