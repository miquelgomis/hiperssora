import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { searchProducts } from "@/lib/search"
import { getTicketTotal } from "@/lib/ticket"
import { posScreenMock } from "@/mocks/pos-screen"
import { catalog } from "@/mocks/products"
import { mockSearch, mockSectionCatalog } from "@/mocks/search"
import { mockDate } from "@/mocks/tickets"

import { PaymentMethodDialog } from "../payment"
import { ProductSearchDialog } from "../ticket"
import { PosScreen } from "./pos-screen"

const meta = {
  title: "TPV/Pantalla/PosScreen",
  component: PosScreen,
  args: {
    ...posScreenMock,
    date: mockDate,
    search: mockSearch,
    loadSection: mockSectionCatalog,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Pantalla principal del TPV, tal y como la ve el cajero. Compone `PosHeader`, `TicketPanel`, `CheckoutPanel` y `ShortcutsBar` en una rejilla de toda la ventana (ticket ≈70 %, panel de cobro ≈30 %, sin scroll de página). Es presentacional: recibe las líneas por props. En la app, el estado lo pone `PosApp`.",
      },
      story: { inline: false, iframeHeight: 900 },
    },
  },
} satisfies Meta<typeof PosScreen>

export default meta
type Story = StoryObj<typeof meta>

/** Compra en curso con una línea seleccionada. */
export const Default: Story = {}

/** Caja vacía, esperando al siguiente cliente. */
export const EmptyTicket: Story = {
  args: { lines: [], selectedLineId: undefined },
}

/** Modal de búsqueda abierto sobre la pantalla. */
export const Searching: Story = {
  render: (args) => (
    <>
      <PosScreen {...args} />
      <ProductSearchDialog
        open
        query="leche"
        results={searchProducts(catalog, "leche", 8)}
      />
    </>
  ),
}

/** Multiplicador activo en el teclado numérico. */
export const Multiplying: Story = {
  args: { numpad: { value: "6", isMultiplying: true } },
}

/** Al pulsar Cobrar se abre la selección de forma de pago. */
export const Charging: Story = {
  render: (args) => (
    <>
      <PosScreen {...args} />
      <PaymentMethodDialog open total={getTicketTotal(args.lines)} />
    </>
  ),
}
