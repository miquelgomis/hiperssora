import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { products } from "@/mocks/products"

import { SearchResultItem } from "./search-result-item"

const meta = {
  title: "TPV/Ticket/Buscador/SearchResultItem",
  component: SearchResultItem,
  args: {
    product: products.jamon,
    query: "jam",
    onSelect: fn(),
    onActivate: fn(),
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Resultado del modal de búsqueda: foto, nombre con el **EAN debajo** y precio. La parte que coincide con lo buscado se resalta en rojo, tanto en el nombre como en el EAN. El resultado **activo** (↑/↓ o al pasar el dedo) se marca como la línea seleccionada del ticket. Los productos +18 llevan su distintivo. Mide 72 px de alto.\n\n**Todos los estados** reúne en una sola vista cada variante: normal, activo, coincidencia en el EAN, +18 y con foto.",
      },
    },
  },
  decorators: [
    (Story) => (
      <ul role="listbox" aria-label="Resultados" className="max-w-3xl">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof SearchResultItem>

export default meta
type Story = StoryObj<typeof meta>

/** Coincidencia en el nombre. */
export const MatchByName: Story = {}

/** Coincidencia en una parte del EAN. */
export const MatchByEan: Story = {
  args: { query: "0012" },
}

/** Resultado activo: Enter lo añade. */
export const Active: Story = {
  args: { active: true },
}

/** Producto +18: lleva el distintivo junto al nombre. */
export const AgeRestricted: Story = {
  args: { product: products.cerveza, query: "cerv" },
}

/** Con la foto del producto (en la app, la de Nutriinfo). */
export const WithImage: Story = {
  args: {
    product: {
      ...products.platano,
      imageUrl:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=96&h=96&fit=crop",
    },
    query: "plát",
  },
}

/** Todos los estados en una sola vista. */
export const AllStates: Story = {
  name: "Todos los estados",
  decorators: [(Story) => <Story />],
  render: (args) => (
    <div className="grid max-w-3xl gap-6">
      <State label="Normal">
        <ul role="listbox" aria-label="Normal">
          <SearchResultItem {...args} />
        </ul>
      </State>
      <State label="Activo (↑/↓): Enter lo añade">
        <ul role="listbox" aria-label="Activo">
          <SearchResultItem {...args} active />
        </ul>
      </State>
      <State label="Coincidencia en el EAN">
        <ul role="listbox" aria-label="Coincidencia en el EAN">
          <SearchResultItem {...args} query="0012" />
        </ul>
      </State>
      <State label="Producto +18">
        <ul role="listbox" aria-label="Producto +18">
          <SearchResultItem {...args} product={products.cerveza} query="cerv" />
        </ul>
      </State>
      <State label="Con foto">
        <ul role="listbox" aria-label="Con foto">
          <SearchResultItem
            {...args}
            product={{
              ...products.platano,
              imageUrl:
                "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=96&h=96&fit=crop",
            }}
            query="plát"
          />
        </ul>
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
