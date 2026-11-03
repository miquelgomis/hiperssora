import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ScanNotice } from "./scan-notice"

const meta = {
  title: "TPV/Cabecera/ScanNotice",
  component: ScanNotice,
  args: { ean: "8410012345678" },
  parameters: {
    docs: {
      description: {
        component:
          "Aviso de la **pistola lectora** mientras se consulta el código (*Leyendo código…*). Vive **en la cabecera**, en el hueco entre el logotipo y la hora (slot `notice` de `PosHeader`): una píldora gris y pequeña que molesta lo menos posible, sin tapar ni desplazar el ticket. Si el producto se encuentra, se añade y el aviso desaparece; si no existe o falla la consulta, se abre `ProductNotFoundDialog`.",
      },
    },
  },
} satisfies Meta<typeof ScanNotice>

export default meta
type Story = StoryObj<typeof meta>

/** Consultando el código leído. */
export const Searching: Story = { name: "Leyendo código" }
