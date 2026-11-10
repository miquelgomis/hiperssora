import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"

import { products } from "@/mocks/products"

import { SelectedLinePanel } from "./selected-line-panel"

const line = { id: "l1", product: products.leche, quantity: 3 }

const meta = {
  title: "TPV/Panel de cobro/SelectedLinePanel",
  component: SelectedLinePanel,
  args: {
    className: "px-6 py-4",
    line,
    numpad: {
      value: "3",
      unitLabel: "ud",
      allowDecimal: false,
      onKeyPress: fn(),
    },
  },
  argTypes: { line: { control: false }, numpad: { control: false } },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Franja del panel de cobro que actúa sobre el **producto seleccionado** del ticket, no sobre la compra entera. Va **fija al pie del panel, de borde a borde**, sobre **fondo gris claro** (el rojo se leería como un error), con la foto y el nombre del producto que modifica. 

- Muestra la foto, el nombre y el **visor de la cantidad**, que se cambia con el **teclado físico** de la caja (dígitos + \\\`Enter\\\`, \\\`+\\\`/\\\`−\\\`).
- **Las teclas en pantalla van plegadas.** El botón **Teclado** las despliega (\`keypadOpen\` / \`onKeypadOpenChange\`). En la app, \`PosApp\` recuerda la preferencia entre recargas.`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[28rem] border-x">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectedLinePanel>

export default meta
type Story = StoryObj<typeof meta>

/** Teclas plegadas: solo el visor. */
export const Collapsed: Story = {}

/** Teclas desplegadas. */
export const Expanded: Story = {
  args: { defaultKeypadOpen: true },
}

/** Tecleando un número (pendiente de aplicar con Enter). */
export const Editing: Story = {
  args: {
    numpad: {
      value: "24",
      unitLabel: "ud",
      isEditing: true,
      allowDecimal: false,
    },
  },
}

/** Sin línea seleccionada: zona neutra. */
export const NoSelection: Story = {
  args: { line: undefined, numpad: { value: "" } },
}

/** El botón Teclado despliega y pliega las teclas. */
export const ToggleKeypad: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = canvas.getByRole("button", { name: /Teclado/ })
    await expect(canvas.queryByRole("button", { name: "7" })).toBeNull()
    await userEvent.click(toggle)
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "7" })).toBeVisible()
    )
    await userEvent.click(toggle)
    await waitFor(() =>
      expect(canvas.queryByRole("button", { name: "7" })).toBeNull()
    )
  },
}
