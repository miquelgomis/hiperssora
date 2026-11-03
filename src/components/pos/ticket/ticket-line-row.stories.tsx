import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { products } from "@/mocks/products"

import { TicketLineRow } from "./ticket-line-row"

const meta = {
  title: "TPV/Ticket/Líneas/TicketLineRow",
  component: TicketLineRow,
  args: {
    line: { id: "l1", product: products.cerveza, quantity: 6 },
    onSelect: fn(),
    onChangeQuantity: fn(),
    onRemove: fn(),
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Fila del ticket: foto, nombre con el EAN debajo, cantidad (unidades o kilos con 3 decimales), precio unitario e importe. Toda la fila es táctil. La fila **seleccionada** (por defecto, la última añadida) se resalta en rojo corporativo y se **despliega** con `TicketLineEditor` para cambiar la cantidad o eliminarla. Solo hay una desplegada: al tocar otra, se despliega esa. Es también la que mueven `↑`/`↓` y la que cambia la tecla *Cantidad*.\n\n**Todos los estados** reúne en una sola vista cada variante: sin seleccionar (por unidades, al peso, +18, con foto), seleccionada y desplegada, con la cantidad mínima (− pasa a pedir eliminar) y pidiendo confirmación para eliminar.",
      },
    },
  },
  decorators: [
    (Story) => (
      <ul aria-label="Ticket" className="max-w-5xl border-t">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof TicketLineRow>

export default meta
type Story = StoryObj<typeof meta>

/** Producto por unidades. */
export const ByUnit: Story = {
  args: { line: { id: "l1", product: products.leche, quantity: 3 } },
}

/** Producto +18 (alcohol): lleva el distintivo junto al nombre. */
export const AgeRestricted: Story = {
  args: { line: { id: "l4", product: products.cerveza, quantity: 6 } },
}

/** Producto al peso. */
export const ByWeight: Story = {
  args: { line: { id: "l2", product: products.platano, quantity: 1.25 } },
}

/** Seleccionada y desplegada para editar. */
export const Selected: Story = {
  args: { selected: true },
}

/** Con la foto del producto. */
export const WithImage: Story = {
  args: {
    line: {
      id: "l5",
      product: {
        ...products.platano,
        imageUrl:
          "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=96&h=96&fit=crop",
      },
      quantity: 1.25,
    },
  },
}

/** Seleccionada con la cantidad mínima: − ya no resta, pide eliminar. */
export const SelectedAtMinimum: Story = {
  args: {
    selected: true,
    line: { id: "l3", product: products.jamon, quantity: 1 },
  },
}

/** Seleccionada y pidiendo confirmación para eliminarla (Eliminar, − en el mínimo o Supr). */
export const ConfirmingRemoval: Story = {
  args: {
    selected: true,
    confirmingRemoval: true,
    onConfirmingRemovalChange: fn(),
  },
}

/** Todos los estados en una sola vista. */
export const AllStates: Story = {
  name: "Todos los estados",
  decorators: [(Story) => <Story />],
  render: (args) => {
    const row = (props: Partial<typeof args>) => (
      <ul aria-label="Ticket" className="border-t">
        <TicketLineRow {...args} {...props} />
      </ul>
    )
    return (
      <div className="grid max-w-5xl gap-6">
        <State label="Por unidades">
          {row({ line: { id: "a", product: products.leche, quantity: 3 } })}
        </State>
        <State label="Al peso">
          {row({
            line: { id: "b", product: products.platano, quantity: 1.25 },
          })}
        </State>
        <State label="Producto +18">
          {row({ line: { id: "c", product: products.cerveza, quantity: 6 } })}
        </State>
        <State label="Con foto">
          {row({
            line: {
              id: "d",
              product: {
                ...products.platano,
                imageUrl:
                  "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=96&h=96&fit=crop",
              },
              quantity: 1.25,
            },
          })}
        </State>
        <State label="Seleccionada: desplegada para editar">
          {row({ selected: true })}
        </State>
        <State label="Seleccionada al peso: − / + de 100 g">
          {row({
            selected: true,
            line: { id: "e", product: products.platano, quantity: 1.25 },
          })}
        </State>
        <State label="Cantidad mínima: − pide eliminar">
          {row({
            selected: true,
            line: { id: "f", product: products.jamon, quantity: 1 },
          })}
        </State>
        <State label="Confirmando eliminación">
          {row({ selected: true, confirmingRemoval: true })}
        </State>
      </div>
    )
  },
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
