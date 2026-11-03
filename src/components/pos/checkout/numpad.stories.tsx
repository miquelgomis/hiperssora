import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { Numpad } from "./numpad"

const meta = {
  title: "TPV/Panel de cobro/Numpad",
  component: Numpad,
  args: {
    value: "16",
    productName: "Cerveza rubia lata 33 cl",
    unitLabel: "ud",
    allowDecimal: false,
    onKeyPress: fn(),
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Teclado numérico táctil con visor. Teclas de 48 px de alto. Trabaja sobre la **línea seleccionada** del ticket (hook \`useQuantityEntry\` en \`PosApp\`).

| Situación | Visor |
| --- | --- |
| Línea recién añadida | \`1\` y el nombre del producto |
| Línea seleccionada con 16 unidades | \`16 ud\` |
| Producto al peso | \`1,250 kg\` |
| Tecleando \`2\` \`4\` | \`24\` resaltado en rojo, *Pulsa Cantidad para aplicar* |
| Tras pulsar **Cantidad** | La línea pasa a 24 y el visor vuelve a mostrar su cantidad |

- **Al teclear se empieza de cero:** el número nuevo sustituye a la cantidad, no se le suma.
- \`⌫\` borra un dígito y \`C\` descarta lo tecleado. Cambiar de línea también lo descarta.
- **La coma** solo se habilita en productos al peso. **Cantidad** solo se habilita con un número tecleado.
- **Multiplicar:** \`6\` + \`*\` en el teclado físico → el visor muestra \`6 ×\` y el siguiente producto que entre lo hará con cantidad 6. No tiene tecla en pantalla.
- **Cantidad** ocupa dos filas, porque es la tecla más importante, y se ilumina en rojo cuando hay un número tecleado que aplicar.
- **Teclado físico:** los dígitos, \`,\`, \`Retroceso\` y \`Enter\` (= *Cantidad*) funcionan igual que en pantalla. Por ejemplo: escanear unos macarrones, teclear \`5\` y pulsar \`Enter\` → 5 paquetes.`,
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
} satisfies Meta<typeof Numpad>

export default meta
type Story = StoryObj<typeof meta>

/** Muestra la cantidad de la línea seleccionada. */
export const SelectedLine: Story = {}

/** Línea al peso: la coma está habilitada. */
export const ByWeight: Story = {
  args: {
    value: "1,250",
    productName: "Plátano de Canarias",
    unitLabel: "kg",
    allowDecimal: true,
  },
}

/** Número tecleado pendiente de aplicar con *Cantidad*. */
export const Editing: Story = {
  args: { value: "24", isEditing: true },
}

/** Sin líneas en el ticket. */
export const Empty: Story = {
  args: {
    value: "",
    productName: undefined,
    canApplyQuantity: false,
  },
}

/** Multiplicador activo: se aplicará al siguiente producto. */
export const Multiplying: Story = {
  args: { value: "6", isMultiplying: true },
}
