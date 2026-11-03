import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { cashier } from "@/config/auth"
import { mockDate, pausedTickets } from "@/mocks/tickets"

import { PosHeader } from "./pos-header"
import { ScanNotice } from "./scan-notice"

const meta = {
  title: "TPV/Cabecera/PosHeader",
  component: PosHeader,
  args: { cashier, pausedTickets, date: mockDate },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Barra superior del TPV. Compone `Logo`, `Clock`, `PausedTicketsDialog` y `UserDialog`. En el hueco entre el logotipo y la hora salen los avisos (`notice`), como `ScanNotice`. Los botones abren modales, nunca desplegables (interfaz táctil).",
      },
    },
  },
} satisfies Meta<typeof PosHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Con un aviso en el hueco central: la pistola está leyendo un código. */
export const WithNotice: Story = {
  args: { notice: <ScanNotice ean="8410012345678" /> },
}

export const WithoutPausedTickets: Story = {
  args: { pausedTickets: [] },
}
