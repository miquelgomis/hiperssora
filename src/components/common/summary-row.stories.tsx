import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { SummaryRow } from "./summary-row"

const meta = {
  title: "Comunes/SummaryRow",
  component: SummaryRow,
  args: {
    label: "3 artículos",
    value: "12,40 €",
    variant: "plain",
    size: "lg",
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    variant: {
      control: "inline-radio",
      options: ["plain", "muted", "outline", "brand"],
    },
    size: { control: "inline-radio", options: ["md", "lg", "xl"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Fila **«rótulo … dato»**: el dato secundario en gris a la izquierda y el principal, en seminegrita y con cifras tabulares, a la derecha. Sirve para resúmenes, importes y el cambio a devolver.\n\n- **Variantes** (`variant`): `plain` (sin caja), `muted` (caja gris: resumen de la compra), `outline` (caja con borde: un dato que se está introduciendo, como *Entregado*) y `brand` (caja roja suave con el dato en rojo: lo que hay que devolver, el *Cambio*).\n- **Tamaños del dato** (`size`): `md` (16 px), `lg` (24 px, por defecto) y `xl` (30 px).\n\nLa usan los modales de confirmación `PauseTicketDialog` y `ClearTicketDialog` (resumen de la compra) y el flujo de cobro.\n\n**Todos los estados** reúne variantes y tamaños en una sola vista.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SummaryRow>

export default meta
type Story = StoryObj<typeof meta>

/** Sin caja: «Importe … 2,46 €». */
export const Plain: Story = {
  args: { label: "Importe", value: "2,46 €" },
}

/** Caja gris: resumen de la compra en un modal de confirmación. */
export const Muted: Story = {
  args: { variant: "muted" },
}

/** Caja con borde: el importe entregado que se está introduciendo. */
export const Outline: Story = {
  args: { variant: "outline", label: "Entregado", value: "20,00 €" },
}

/** Caja de la marca: el cambio a devolver, en rojo. */
export const Brand: Story = {
  args: { variant: "brand", label: "Cambio", value: "7,60 €", size: "xl" },
}

/** Todos los estados en una sola vista. */
export const AllStates: Story = {
  name: "Todos los estados",
  render: (args) => (
    <div className="grid gap-6">
      <State label="Plain">
        <SummaryRow {...args} label="Importe" value="2,46 €" />
      </State>
      <State label="Muted">
        <SummaryRow {...args} variant="muted" />
      </State>
      <State label="Outline">
        <SummaryRow
          {...args}
          variant="outline"
          label="Entregado"
          value="20,00 €"
        />
      </State>
      <State label="Brand">
        <SummaryRow {...args} variant="brand" label="Cambio" value="7,60 €" />
      </State>
      <State label="Tamaño md (16 px)">
        <SummaryRow {...args} variant="muted" size="md" />
      </State>
      <State label="Tamaño lg (24 px)">
        <SummaryRow {...args} variant="muted" size="lg" />
      </State>
      <State label="Tamaño xl (30 px)">
        <SummaryRow {...args} variant="muted" size="xl" />
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
