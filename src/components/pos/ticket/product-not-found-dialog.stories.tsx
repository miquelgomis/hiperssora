import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"

import { ProductNotFoundDialog } from "./product-not-found-dialog"

const meta = {
  title: "TPV/Ticket/Avisos/ProductNotFoundDialog",
  component: ProductNotFoundDialog,
  args: {
    status: { state: "not-found", ean: "8400000000001" },
    onSearch: fn(),
    onRetry: fn(),
    onClose: fn(),
  },
  argTypes: { status: { control: false } },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Aviso cuando la **pistola lectora** lee un código que no se puede añadir.

| Estado | Cuándo | Botones |
| --- | --- | --- |
| \`not-found\` | El código **no existe** en el catálogo, está mal leído o no es válido | *Cerrar* · **Buscar producto** |
| \`error\` | **Falla la consulta** al catálogo (sin conexión) | *Cerrar* · *Reintentar* · **Buscar producto** |

- Muestra el código leído en grande, para poder compararlo con la etiqueta.
- **Buscar producto** cierra el aviso y abre el buscador (\`ProductSearchDialog\`) para encontrarlo por su nombre. Nunca hay dos modales a la vez.
- **Teclado:** el foco empieza en *Buscar producto* (\`Enter\`) y \`Esc\` cierra.
- Mientras se consulta el código, en vez de este modal se ve \`ScanNotice\` (*Leyendo código…*).`,
      },
      story: { inline: false, iframeHeight: 560 },
    },
  },
} satisfies Meta<typeof ProductNotFoundDialog>

export default meta
type Story = StoryObj<typeof meta>

/** El código no está en el catálogo. */
export const NotFound: Story = { name: "Producto no encontrado" }

/** Ha fallado la consulta: se puede reintentar. */
export const Error: Story = {
  name: "Error al consultar",
  args: { status: { state: "error", ean: "8410012345678" } },
}

/** Enter (con el foco en Buscar producto) abre el buscador. */
export const EnterSearches: Story = {
  play: async ({ args }) => {
    const search = await screen.findByRole("button", {
      name: /Buscar producto/,
    })
    await waitFor(() => expect(search).toHaveFocus())
    await userEvent.keyboard("{Enter}")
    await expect(args.onSearch).toHaveBeenCalledOnce()
  },
}
