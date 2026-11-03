import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import { products } from "@/mocks/products"

import { TicketLineEditor } from "./ticket-line-editor"

const meta = {
  title: "TPV/Ticket/Líneas/TicketLineEditor",
  component: TicketLineEditor,
  args: {
    line: { id: "l1", product: products.cerveza, quantity: 6 },
    onChangeQuantity: fn(),
    onRemove: fn(),
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Franja que se **despliega bajo la línea seleccionada** del ticket (\`TicketLineRow\`). Solo hay una desplegada a la vez.

- **Disposición:** *Eliminar* a la izquierda, bajo el nombre del producto, y la cantidad a la derecha, alineada con las columnas de cantidad y precio.
- **− / +** cambian la cantidad: de 1 en 1 por unidades y de 100 g en 100 g al peso. Botones de 56 px.
- **Eliminar** quita la línea del ticket.
- **Confirmación en la propia franja**, sin modal: *¿Eliminar «…» del ticket?* con **Cancelar** y **Sí, eliminar**. Aparece al pulsar *Eliminar* o al pulsar **−** con la cantidad mínima (1 unidad o 100 g o menos).`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-5xl bg-brand-soft">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TicketLineEditor>

export default meta
type Story = StoryObj<typeof meta>

/** Producto por unidades. */
export const ByUnit: Story = {}

/** Producto al peso: − / + de 100 g en 100 g. */
export const ByWeight: Story = {
  args: { line: { id: "l2", product: products.platano, quantity: 1.25 } },
}

/** Pidiendo confirmación para eliminar. */
export const ConfirmingRemoval: Story = {
  args: { defaultConfirming: true },
}

/** Con 1 unidad, − no resta: pide confirmación para eliminar. */
export const MinusOnLastUnit: Story = {
  args: { line: { id: "l3", product: products.jamon, quantity: 1 } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Restar" }))
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "¿Eliminar Jamón cocido extra 200 g del ticket?"
    )
    await expect(args.onChangeQuantity).not.toHaveBeenCalled()

    await userEvent.click(canvas.getByRole("button", { name: "Sí, eliminar" }))
    await expect(args.onRemove).toHaveBeenCalledWith("l3")
  },
}
