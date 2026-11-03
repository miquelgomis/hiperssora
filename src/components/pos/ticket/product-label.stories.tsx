import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { products } from "@/mocks/products"

import { ProductLabel } from "./product-label"

const meta = {
  title: "TPV/Ticket/Buscador/ProductLabel",
  component: ProductLabel,
  args: {
    product: products.jamon,
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Cómo se identifica un producto en todo el TPV: **nombre** y, debajo, el **código EAN** en gris y monoespaciado (no en una columna aparte). Los productos **+18** llevan su distintivo junto al nombre, y los nombres largos se cortan con puntos suspensivos.\n\nCon `query`, resalta lo buscado en el nombre y en el EAN (`HighlightMatch`). Lo usan las líneas del ticket (`TicketLineRow`) y los resultados del buscador (`SearchResultItem`).\n\n**Todos los estados** reúne en una sola vista cada variante.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductLabel>

export default meta
type Story = StoryObj<typeof meta>

/** Nombre con el EAN debajo. */
export const Default: Story = {}

/** Producto +18: distintivo junto al nombre. */
export const AgeRestricted: Story = {
  args: { product: products.cerveza },
}

/** Coincidencia de la búsqueda en el nombre. */
export const MatchInName: Story = {
  args: { query: "cocido" },
}

/** Coincidencia de la búsqueda en el EAN (basta un fragmento de 4 dígitos). */
export const MatchInEan: Story = {
  args: { query: "1234" },
}

/** Todos los estados en una sola vista. */
export const AllStates: Story = {
  name: "Todos los estados",
  render: (args) => (
    <div className="grid gap-6">
      <State label="Normal">
        <ProductLabel {...args} />
      </State>
      <State label="Producto +18">
        <ProductLabel {...args} product={products.cerveza} />
      </State>
      <State label="Coincidencia en el nombre">
        <ProductLabel {...args} query="cocido" />
      </State>
      <State label="Coincidencia en el EAN">
        <ProductLabel {...args} query="1234" />
      </State>
      <State label="Nombre largo">
        <ProductLabel
          {...args}
          product={{
            ...products.cerveza,
            name: "Cerveza rubia especial tostada lata 33 cl pack de 12",
          }}
        />
      </State>
    </div>
  ),
}

/** Rótulo de cada estado en las galerías de estados. */
function State({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid gap-2">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </h3>
      {children}
    </section>
  )
}
