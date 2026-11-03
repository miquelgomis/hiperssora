import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { getItemCount, getTicketTotal } from "@/lib/ticket"
import { products } from "@/mocks/products"
import { mockSectionCatalog } from "@/mocks/search"
import { ticketLines } from "@/mocks/tickets"

import { CheckoutPanel } from "./checkout-panel"

const meta = {
  title: "TPV/Panel de cobro/CheckoutPanel",
  component: CheckoutPanel,
  args: {
    total: getTicketTotal(ticketLines),
    itemCount: getItemCount(ticketLines),
    bagProduct: products.bolsa,
    selectedLine: ticketLines[2],
    loadSection: mockSectionCatalog,
    onAddProduct: fn(),
    onCharge: fn(),
    onPauseTicket: fn(),
    onClearTicket: fn(),
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Columna derecha del TPV (≈30 % del ancho). Cabe entera sin scroll y separa el **alcance** de cada acción: arriba, la **compra** (`TicketTotal`, **Cobrar** y `TicketActions`: Pausar y Anular compra); en medio, **añadir** (Frutería, Verdulería y Panadería en grande, y `AddBagButton` debajo, con contador); y fija al pie, de borde a borde, la franja del **producto seleccionado** (`SelectedLinePanel`), sobre fondo gris claro, con el producto que modifica y las teclas plegadas. Esa franja **solo aparece** (deslizándose desde abajo) cuando hay una línea seleccionada o un multiplicador pendiente: con el ticket vacío no se muestra.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-[60rem] w-[28rem] overflow-y-auto border-x">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CheckoutPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Multiplying: Story = {
  args: { numpad: { value: "6", isMultiplying: true } },
}

/** Ticket vacío: *Pausar*, *Anular compra* y *Cobrar* desactivados, y sin franja de producto seleccionado. */
export const Empty: Story = {
  args: { total: 0, itemCount: 0 },
}
