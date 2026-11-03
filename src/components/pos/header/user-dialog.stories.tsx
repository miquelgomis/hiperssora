import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { cashier } from "@/config/auth"

import { UserDialog } from "./user-dialog"

const meta = {
  title: "TPV/Cabecera/UserDialog",
  component: UserDialog,
  args: { cashier, onLock: fn(), onLogout: fn() },
  parameters: {
    docs: {
      description: {
        component:
          "Cajero conectado y número de caja. Al pulsarlo se abre un **modal** con **Bloquear pantalla** (pausa sin cerrar sesión) y **Cerrar sesión**. Se cierra con la X, pulsando fuera o eligiendo una opción.",
      },
      story: { inline: false, iframeHeight: 460 },
    },
  },
} satisfies Meta<typeof UserDialog>

export default meta
type Story = StoryObj<typeof meta>

/** Botón de la cabecera, cerrado. */
export const Default: Story = {}

/** Modal abierto. */
export const Open: Story = {
  args: { defaultOpen: true },
}
