import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { NumpadDisplay } from "./numpad-display"

const meta = {
  title: "TPV/Panel de cobro/NumpadDisplay",
  component: NumpadDisplay,
  args: { value: "6", productName: "Cerveza rubia lata 33 cl" },
  parameters: {
    docs: {
      description: {
        component:
          "Visor del teclado numérico (`Numpad`). Muestra la **cantidad de la línea seleccionada**, nunca un 0 sin sentido: `6`, o `1,250 kg` en productos al peso. Al teclear se resalta en rojo con *Pulsa Cantidad para aplicar* (o *Enter*, con las teclas plegadas). Con un multiplicador pendiente (`6` `*`), *Siguiente producto ×*.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NumpadDisplay>

export default meta
type Story = StoryObj<typeof meta>

/** Cantidad de la línea seleccionada. */
export const Current: Story = {}

/** Producto al peso: con su unidad. */
export const ByWeight: Story = {
  args: { value: "1,250", unitLabel: "kg", productName: "Plátano de Canarias" },
}

/** Número tecleado por aplicar. */
export const Editing: Story = { args: { value: "24", isEditing: true } }

/** Multiplicador pendiente: el siguiente producto entra con esa cantidad. */
export const Multiplying: Story = { args: { value: "6", isMultiplying: true } }

/** Todos los estados en una sola vista. */
export const AllStates: Story = {
  name: "Todos los estados",
  decorators: [(Story) => <Story />],
  render: (args) => (
    <div className="grid w-80 gap-6">
      <State label="Cantidad actual">
        <NumpadDisplay {...args} />
      </State>
      <State label="Al peso">
        <NumpadDisplay {...args} {...ByWeight.args} />
      </State>
      <State label="Tecleando">
        <NumpadDisplay {...args} {...Editing.args} />
      </State>
      <State label="Multiplicando">
        <NumpadDisplay {...args} {...Multiplying.args} />
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
