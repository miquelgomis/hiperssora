import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Apple, Banknote, CreditCard } from "lucide-react"
import { fn } from "storybook/test"

import { OptionCard } from "./option-card"

const meta = {
  title: "Comunes/OptionCard",
  component: OptionCard,
  args: { onClick: fn(), icon: Apple, label: "Frutería", shortcutKey: "F5" },
  argTypes: {
    icon: { control: false },
    children: { control: false },
    size: { control: "inline-radio", options: ["md", "lg"] },
  },
  parameters: {
    docs: {
      description: {
        component: `**La tarjeta táctil del TPV**, la única: fondo blanco con borde que, al pasar el dedo o con el foco del teclado, se tiñe del rojo suave de la marca.

| Uso | Cómo |
| --- | --- |
| Botones de sección (Frutería, Verdulería, Panadería) | \`icon\` + \`label\` + \`shortcutKey\`, tamaño \`md\` (80 px) |
| Formas de pago (Tarjeta, Efectivo) | \`icon\` + \`label\` + \`description\`, tamaño \`lg\` (176 px) |
| Compra en pausa (\`PausedTicketItem\`) y producto del catálogo (\`ProductTile\`) | Contenido propio con \`children\` |`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OptionCard>

export default meta
type Story = StoryObj<typeof meta>

/** Botón de sección, con su tecla en la esquina. */
export const Section: Story = {}

/** Forma de pago: más grande y con una línea de ayuda. */
export const PaymentMethod: Story = {
  args: {
    size: "lg",
    icon: CreditCard,
    label: "Tarjeta",
    description: "Datáfono o móvil",
    shortcutKey: undefined,
  },
}

/** Las dos formas de pago, una junto a otra (`←` `→` cambian y `Enter` elige). */
export const PaymentMethods: Story = {
  decorators: [(Story) => <Story />],
  render: (args) => (
    <div className="grid w-[32rem] grid-cols-2 gap-4">
      <OptionCard
        {...args}
        size="lg"
        icon={CreditCard}
        label="Tarjeta"
        description="Datáfono o móvil"
        shortcutKey={undefined}
      />
      <OptionCard
        {...args}
        size="lg"
        icon={Banknote}
        label="Efectivo"
        description="Calcula el cambio"
        shortcutKey={undefined}
      />
    </div>
  ),
}
