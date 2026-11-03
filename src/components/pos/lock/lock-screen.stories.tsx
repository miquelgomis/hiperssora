import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"

import { cashier, mockDate } from "@/mocks/tickets"

import { LockScreen } from "./lock-screen"

const meta = {
  title: "TPV/Bloqueo/LockScreen",
  component: LockScreen,
  args: { cashier, date: mockDate, onUnlock: fn() },
  argTypes: {
    variant: { control: "inline-radio", options: ["welcome", "locked"] },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Pantalla de bloqueo. Cubre todo el TPV y pide el PIN del cajero.

| Variante | Cuándo aparece | Mensaje |
| --- | --- | --- |
| \`welcome\` | Al entrar por primera vez (cada turno empieza bloqueado) y al pulsar **Cerrar sesión** | *Hola, Miquel · Introduce tu PIN para empezar a trabajar* |
| \`locked\` | Al pulsar **Bloquear pantalla** en el modal del cajero | *Pantalla bloqueada · Miquel Gomis, introduce tu PIN para continuar* |

**Entrada del PIN:** solo con el **teclado físico** de la caja (dígitos; \`Retroceso\` borra y \`Esc\` limpia). No hay teclado en pantalla.

**Transiciones:** las mismas que los modales de la app. Entra con un fundido corto (200 ms) y el contenido acercándose (95 % → 100 %). Con el PIN correcto, los puntos se ponen en verde un instante y la pantalla sale igual que un modal al cerrarse; al terminar se llama a \`onUnlock\`. Con un PIN incorrecto, los puntos se ponen en rojo y se vacía.

**Maqueta:** el PIN es \`1111\` (\`src/config/auth.ts\`) y se muestra en pantalla a propósito.

> Haz clic en el lienzo y teclea el PIN para probarla.`,
      },
      story: { inline: false, iframeHeight: 800 },
    },
  },
} satisfies Meta<typeof LockScreen>

export default meta
type Story = StoryObj<typeof meta>

/** Primera entrada del turno. */
export const Welcome: Story = {
  args: { variant: "welcome" },
}

/** Tras pulsar *Bloquear pantalla*. */
export const Locked: Story = {
  args: { variant: "locked" },
}

/** Con el PIN correcto (1111), tras la animación de salida se llama a `onUnlock`. */
export const CorrectPin: Story = {
  play: async ({ args }) => {
    await userEvent.keyboard("1111")
    await waitFor(() => expect(args.onUnlock).toHaveBeenCalledOnce(), {
      timeout: 2000,
    })
  },
}

/** Con un PIN incorrecto se muestra el error y no se desbloquea. */
export const WrongPin: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.keyboard("1234")
    const error = await within(canvasElement).findByText(
      "PIN incorrecto. Inténtalo de nuevo."
    )
    // Se espera a que termine el fundido de entrada.
    await waitFor(() => expect(error).toBeVisible())
    await expect(args.onUnlock).not.toHaveBeenCalled()
  },
}
