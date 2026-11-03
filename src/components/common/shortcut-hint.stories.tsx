import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { HintBar, ShortcutHint } from "./shortcut-hint"

const meta = {
  title: "Comunes/ShortcutHint",
  component: ShortcutHint,
  subcomponents: { HintBar },
  args: {
    keyLabel: "F2",
    label: "Buscar",
  },
  argTypes: {
    label: { control: "text" },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "**Pista de teclado**: la tecla dibujada como una tecla de verdad (`Kbd`) y, al lado, lo que hace. Es un `<li>`, así que va siempre dentro de una lista.\n\n**`HintBar`** es la franja gris de 48 px que las agrupa, al pie de la pantalla o de un modal, con un hueco opcional a la derecha (`end`) para un contador o un estado. Si no caben, las pistas se cortan sin hacer saltar de línea la franja.\n\nLas usa el modal de búsqueda (`ProductSearchDialog`): `↑↓` navegar, `Enter` añadir y `Esc` cerrar, con el número de resultados a la derecha.",
      },
    },
  },
  decorators: [
    (Story) => (
      <ul className="flex gap-5">
        <Story />
      </ul>
    ),
  ],
} satisfies Meta<typeof ShortcutHint>

export default meta
type Story = StoryObj<typeof meta>

/** Una tecla y su acción. */
export const Default: Story = {}

/** `HintBar`: la franja al pie del modal de búsqueda, con el contador a la derecha. */
export const InHintBar: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-3xl border">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <HintBar end={<span className="tabular-nums">12 resultados</span>}>
      <ShortcutHint {...args} keyLabel="↑↓" label="Navegar" />
      <ShortcutHint {...args} keyLabel="Enter" label="Añadir" />
      <ShortcutHint {...args} keyLabel="Esc" label="Cerrar" />
    </HintBar>
  ),
}
