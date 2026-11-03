import { type ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { QuantityStepper } from "./quantity-stepper"

const meta = {
  title: "Comunes/QuantityStepper",
  component: QuantityStepper,
  args: {
    value: "6 ud",
    onDecrease: fn(),
    onIncrease: fn(),
    size: "md",
  },
  argTypes: {
    value: { control: "text" },
    size: { control: "inline-radio", options: ["md", "lg"] },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "**− cantidad +**: dos botones de 56 px (`icon-xl`) a los lados de la cantidad, que llega **ya formateada** (`6 ud`, `1,250 kg`, `3`) y se anuncia al lector de pantalla al cambiar (`aria-live`). Cada botón se puede desactivar por separado.\n\n- **`md`**: en la franja de edición de la línea del ticket (`TicketLineEditor`), de 1 en 1 por unidades y de 100 g en 100 g al peso.\n- **`lg`**: protagonista de un modal, como el de cuántas piezas de Panadería (`QuantityDialog`).\n\n **Todos los estados** reúne tamaños y botones desactivados.",
      },
    },
  },
} satisfies Meta<typeof QuantityStepper>

export default meta
type Story = StoryObj<typeof meta>

/** Por unidades, en la línea del ticket. */
export const ByUnit: Story = {}

/** Al peso, en la línea del ticket. */
export const ByWeight: Story = {
  args: { value: "1,250 kg" },
}

/** Grande, protagonista de un modal. */
export const Large: Story = {
  args: { size: "lg", value: "3" },
}

/** Con − desactivado (no se puede bajar de la cantidad mínima). */
export const DecreaseDisabled: Story = {
  args: { size: "lg", value: "1", decreaseDisabled: true },
}

/** Todos los estados en una sola vista. */
export const AllStates: Story = {
  name: "Todos los estados",
  render: (args) => (
    <div className="grid gap-6">
      <State label="md · por unidades">
        <QuantityStepper {...args} value="6 ud" />
      </State>
      <State label="md · al peso">
        <QuantityStepper {...args} value="1,250 kg" />
      </State>
      <State label="lg · en un modal">
        <QuantityStepper {...args} size="lg" value="3" />
      </State>
      <State label="lg · − desactivado">
        <QuantityStepper {...args} size="lg" value="1" decreaseDisabled />
      </State>
      <State label="lg · + desactivado">
        <QuantityStepper {...args} size="lg" value="99" increaseDisabled />
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
