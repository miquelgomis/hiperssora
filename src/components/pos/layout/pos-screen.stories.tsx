import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { sections } from "@/config/sections"
import { searchProducts } from "@/lib/search"
import { getTicketTotal, toSectionProducts } from "@/lib/ticket"
import { posScreenMock } from "@/mocks/pos-screen"
import { catalog } from "@/mocks/products"
import { mockDate } from "@/mocks/tickets"

import { PaymentMethodDialog } from "../payment"
import { PosScreen } from "./pos-screen"

const meta = {
  title: "TPV/Pantalla/PosScreen",
  component: PosScreen,
  args: {
    ...posScreenMock,
    date: mockDate,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Pantalla principal del TPV, tal y como la ve el cajero. Compone `PosHeader`, `TicketPanel`, `CheckoutPanel` y `ShortcutsBar` en una rejilla de toda la ventana (ticket ≈70 %, panel de cobro ≈30 %, sin scroll de página). Es solo interfaz: recibe las líneas y el estado de cada zona (buscador, secciones, teclado numérico) por props y avisa con callbacks. En la app, todo lo conecta `PosApp` (`src/features/pos-app`).",
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

/** Modal de búsqueda abierto, con los resultados que recibe en `search`. */
export const Searching: Story = {
  args: {
    searchOpen: true,
    search: { query: "leche", results: searchProducts(catalog, "leche", 8) },
  },
}

/** Frutería abierta, con el catálogo que recibe en `sections`. */
export const SectionOpen: Story = {
  args: {
    openSection: sections[0],
    sections: {
      products: toSectionProducts(
        sections[0],
        catalog.filter((product) => product.categoryId === sections[0].id)
      ),
    },
  },
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
