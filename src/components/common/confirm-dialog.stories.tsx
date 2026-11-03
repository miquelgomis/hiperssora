import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Pause, Trash2 } from "lucide-react"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"

import { ConfirmDialog } from "./confirm-dialog"
import { SummaryRow } from "./summary-row"

const meta = {
  title: "Comunes/ConfirmDialog",
  component: ConfirmDialog,
  args: {
    open: true,
    onOpenChange: fn(),
    onConfirm: fn(),
    icon: Pause,
    title: "¿Pausar la compra?",
    description:
      "Quedará en Clientes en pausa para recuperarla cuando el cliente vuelva, y la caja quedará libre.",
    confirmLabel: "Sí, pausar",
    confirmIcon: Pause,
    children: (
      <SummaryRow variant="muted" label="3 artículos" value="12,40 €" />
    ),
  },
  argTypes: {
    icon: { control: false },
    confirmIcon: { control: false },
    children: { control: false },
    tone: { control: "inline-radio", options: ["brand", "destructive"] },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Confirmación **«¿Seguro que…?»** antes de una acción importante. Es un \`Modal\` centrado y sin X, siempre con la misma estructura:

1. **Icono** de la acción.
2. **Pregunta** (\`title\`): «¿Pausar la compra?».
3. **Qué pasará** (\`description\`) si se confirma.
4. **Sobre qué se actúa** (\`children\`), normalmente un \`SummaryRow\`: artículos e importe, el producto…
5. **Cancelar** y la acción en positivo (\`confirmLabel\`): «Sí, pausar».

Por defecto, *Cancelar* está enfocado al abrir, así que un \`Enter\` despistado no confirma (\`defaultFocus="confirm"\` enfoca la acción, como en la pregunta +18); \`Esc\` o pulsar fuera también cancelan. Con \`tone="destructive"\` (lo que no se puede deshacer, como anular la compra) el icono y el botón de confirmar van en rojo.

Lo usan \`PauseTicketDialog\`, \`ClearTicketDialog\` y \`AgeVerificationDialog\`.`,
      },
      story: { inline: false, iframeHeight: 520 },
    },
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

/** Confirmación normal, en el color de la marca. */
export const Default: Story = {}

/** Lo que no se puede deshacer: icono y botón de confirmar en rojo. */
export const Destructive: Story = {
  args: {
    tone: "destructive",
    icon: Trash2,
    confirmIcon: Trash2,
    title: "¿Anular esta compra?",
    description:
      "Se eliminarán todos los productos del ticket para empezar de cero. Esta acción no se puede deshacer.",
    confirmLabel: "Sí, anular compra",
  },
}

/** Al abrir, el foco está en *Cancelar*; confirmar llama a `onConfirm`. */
export const Keyboard: Story = {
  play: async ({ args }) => {
    const cancel = await screen.findByRole("button", { name: "Cancelar" })
    await waitFor(() => expect(cancel).toHaveFocus())
    await userEvent.click(screen.getByRole("button", { name: /Sí, pausar/ }))
    await expect(args.onConfirm).toHaveBeenCalledOnce()
  },
}
