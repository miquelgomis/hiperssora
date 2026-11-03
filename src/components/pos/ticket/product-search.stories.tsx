import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test"

import { products } from "@/mocks/products"
import { failingSearch, mockSearch } from "@/mocks/search"

import { ProductSearch } from "./product-search"

const meta = {
  title: "TPV/Ticket/Buscador/ProductSearch",
  component: ProductSearch,
  args: { search: mockSearch, onSelect: fn() },
  argTypes: { search: { control: false } },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Buscador completo: \`SearchTrigger\` en la pantalla y \`ProductSearchDialog\` al recibir el foco. Gestiona el estado (abierto, texto y resultado activo) con el hook \`useProductSearch\`, que espera 250 ms a que el cajero deje de escribir antes de buscar.

**Origen de los datos:** por defecto, \`search\` es \`fetchProducts\`, que consulta el catálogo real de [Nutriinfo](https://www.nutriinfo.es) a través de \`/api/products\`, un route handler de Next.js que guarda la API key en el servidor. Busca por nombre o por **código EAN, completo o parcial** (con 4 o más dígitos encuentra los EAN que los contienen). Un EAN completo se busca primero exacto. En Storybook no hay servidor, así que se usa \`mockSearch\`, que filtra el catálogo de ejemplo.

Al elegir un producto llama a \`onSelect\`, cierra el modal y se vacía.

**No muestra productos sueltos** (formato *Pieza*, *1/2 Pieza* o *Granel*: kiwi verde, banana…), que se eligen en Frutería, Verdulería o Panadería. Los envasados, con su propio código de barras, sí salen.`,
      },
      story: { inline: false, iframeHeight: 760 },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductSearch>

export default meta
type Story = StoryObj<typeof meta>

/** Pulsa en el buscador para abrir el modal. */
export const Default: Story = {}

/** Al recibir el foco se abre el modal con el estado vacío. */
export const OpensOnFocus: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("searchbox"))
    await expect(
      await screen.findByText("Escribe para empezar a buscar")
    ).toBeInTheDocument()
  },
}

/** Escribir, esperar los resultados, bajar con ↓ y añadir con Enter. */
export const SearchAndSelect: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("searchbox"))
    const input = await screen.findByRole("searchbox", {
      name: "Buscar producto",
    })
    await waitFor(() => expect(input).toHaveFocus())
    await userEvent.type(input, "an")
    await screen.findByRole("option", { name: /Arándanos/ })
    await userEvent.keyboard("{ArrowDown}{Enter}")
    await expect(args.onSelect).toHaveBeenCalledWith(products.arandanos)
  },
}

/** Si el catálogo no responde, se muestra el estado de error. */
export const SearchError: Story = {
  args: { search: failingSearch },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("searchbox"))
    await userEvent.type(
      await screen.findByRole("searchbox", { name: "Buscar producto" }),
      "leche"
    )
    await expect(
      await screen.findByText("No se ha podido buscar")
    ).toBeInTheDocument()
  },
}
