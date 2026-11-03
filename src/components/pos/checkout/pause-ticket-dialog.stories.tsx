import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { PauseTicketDialog } from "./pause-ticket-dialog"

const meta = {
  title: "TPV/Panel de cobro/PauseTicketDialog",
  component: PauseTicketDialog,
  args: {
    open: true,
    total: 23.4,
    itemCount: 11,
    onOpenChange: fn(),
    onConfirm: fn(),
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Confirmación al pulsar **Pausar** en el panel de cobro, por si al cliente se le ha olvidado algo. Muestra el resumen de la compra. **Sí, pausar** la aparca en *Clientes en pausa* (cabecera) y deja la caja libre para el siguiente cliente; **Cancelar** no hace nada.",
      },
      story: { inline: false, iframeHeight: 520 },
    },
  },
} satisfies Meta<typeof PauseTicketDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: "Pausar compra" }
