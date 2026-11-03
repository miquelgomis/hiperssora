import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ScannedCode } from "./scanned-code"

const meta = {
  title: "TPV/Ticket/Avisos/ScannedCode",
  component: ScannedCode,
  args: {
    ean: "8410012345670",
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "**Código de barras leído**, en grande, monoespaciado y con las cifras espaciadas sobre una caja gris, para comprobarlo de un vistazo frente al del envase. Lo muestra el modal *Producto no encontrado* (`ProductNotFoundDialog`) cuando la pistola lee un código que no está en el catálogo o falla la consulta.",
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
} satisfies Meta<typeof ScannedCode>

export default meta
type Story = StoryObj<typeof meta>

/** EAN-13, el código más habitual. */
export const Ean13: Story = {}
