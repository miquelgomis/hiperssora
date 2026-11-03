import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { TicketTotal } from "./ticket-total"

const meta = {
  title: "TPV/Panel de cobro/TicketTotal",
  component: TicketTotal,
  args: { total: 34.71, itemCount: 20 },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Importe total del ticket en curso, en lo alto del panel de cobro. Los productos al peso cuentan como un artículo.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[26rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TicketTotal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: { total: 0, itemCount: 0 },
}
