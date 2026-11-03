import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { mockSearch } from "@/mocks/search"
import { ticketLines } from "@/mocks/tickets"

import { TicketPanel } from "./ticket-panel"

const meta = {
  title: "TPV/Ticket/TicketPanel",
  component: TicketPanel,
  args: {
    lines: ticketLines,
    search: mockSearch,
    selectedLineId: ticketLines[2].id,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Columna izquierda del TPV (≈70 % del ancho), **de borde a borde, sin cajas ni márgenes**: `ProductSearch` arriba, como una barra fija sin esquinas, y `TicketList` ocupando todo el resto con su propio scroll. Al tocar el buscador se abre el modal de búsqueda.",
      },
      story: { inline: false, iframeHeight: 720 },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[44rem] border-r">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TicketPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: { lines: [] },
}
