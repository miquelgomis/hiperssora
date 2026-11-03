import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "storybook/test"

import { products } from "@/mocks/products"

import { RemoveLineConfirm } from "./remove-line-confirm"

const meta = {
  title: "TPV/Ticket/Líneas/RemoveLineConfirm",
  component: RemoveLineConfirm,
  args: {
    productName: products.jamon.name,
    onCancel: fn(),
    onConfirm: fn(),
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Confirmación para quitar una línea **en la propia franja** de edición, sin modal: aviso, *¿Eliminar «…» del ticket?*, **Cancelar** y **Sí, eliminar** (en rojo). Aparece al pulsar *Eliminar*, al pulsar − con la cantidad mínima o con `Supr`; con teclado, `Enter` confirma y `Esc` cancela.\n\nDevuelve sus piezas sueltas (un fragmento) para colocarse en la fila flexible de `TicketLineEditor`; aquí se muestra dentro de una franja equivalente.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="flex h-20 max-w-5xl items-center gap-4 bg-destructive/5 px-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RemoveLineConfirm>

export default meta
type Story = StoryObj<typeof meta>

/** Pidiendo confirmación para quitar un producto. */
export const Default: Story = {}

/** *Sí, eliminar* llama a `onConfirm` y *Cancelar*, a `onCancel`. */
export const Actions: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: /Sí, eliminar/ }))
    await expect(args.onConfirm).toHaveBeenCalledOnce()
    await userEvent.click(canvas.getByRole("button", { name: "Cancelar" }))
    await expect(args.onCancel).toHaveBeenCalledOnce()
  },
}
