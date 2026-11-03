import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { ClearTicketDialog } from "./clear-ticket-dialog"

const meta = {
  title: "TPV/Panel de cobro/ClearTicketDialog",
  component: ClearTicketDialog,
  args: {
    open: true,
    total: 34.71,
    itemCount: 21,
    onOpenChange: fn(),
    onConfirm: fn(),
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Confirmación al pulsar **Anular compra**, en la parte inferior del panel de cobro (separado de *Cobrar* para evitar errores). Muestra lo que se va a tirar y avisa de que no se puede deshacer. **Cancelar** está enfocado por defecto, así que *Enter* no anula por accidente. **Sí, anular compra** vacía el ticket para empezar de cero.",
      },
      story: { inline: false, iframeHeight: 520 },
    },
  },
} satisfies Meta<typeof ClearTicketDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { name: "Anular compra" }
