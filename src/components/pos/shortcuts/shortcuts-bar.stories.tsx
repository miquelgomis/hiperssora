import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ShortcutsBar } from "./shortcuts-bar"

const meta = {
  title: "TPV/Barra de atajos/ShortcutsBar",
  component: ShortcutsBar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Barra inferior con la leyenda de atajos de teclado. Tiene **dos variantes**: **con productos** (todos los atajos) y **ticket vacío** (solo lo que se puede hacer sin productos: buscar, bolsa, secciones, multiplicar y salir; no tienen sentido moverse entre líneas, sumar, restar, eliminar, cobrar ni pausar). La pantalla elige la variante según haya productos. Las teclas de las tres secciones (F5–F7) se agrupan en una sola entrada, porque cada botón de sección ya muestra la suya. Los atajos se definen en un único sitio, `src/config/shortcuts.ts`, que leen esta barra y las pistas de los botones (`F1` en *Cobrar*, `F3` en *Bolsa*…).",
      },
    },
  },
} satisfies Meta<typeof ShortcutsBar>

export default meta
type Story = StoryObj<typeof meta>

/** Con productos en el ticket: todos los atajos. */
export const Default: Story = { name: "Con productos" }

/** Ticket vacío: solo buscar, bolsa, secciones, multiplicar y salir. */
export const EmptyTicket: Story = {
  name: "Ticket vacío",
  args: { variant: "empty" },
}
