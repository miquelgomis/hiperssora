import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test"

import { searchProducts } from "@/lib/search"
import { isSoldLoose } from "@/lib/ticket"
import { catalog, products } from "@/mocks/products"

import { ProductSearch } from "./product-search"

/** Resultados de ejemplo para «an», sin los productos sueltos (como en la app). */
const results = searchProducts(catalog, "an", 8).filter(
  (product) => !isSoldLoose(product)
)

const meta = {
  title: "TPV/Ticket/Buscador/ProductSearch",
  component: ProductSearch,
  args: { results, onQueryChange: fn(), onSelect: fn() },
  argTypes: { results: { control: false } },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Buscador completo: \`SearchTrigger\` en la pantalla y \`ProductSearchDialog\` al recibir el foco.

**Es solo interfaz, no busca.** Avisa de lo que se escribe con \`onQueryChange\` y muestra lo que recibe: \`results\`, \`isLoading\` y \`hasError\` (\`ProductSearchState\`). Solo gestiona lo visual: el modal abierto, el texto y el resultado activo. Al elegir un producto llama a \`onSelect\`, cierra el modal y se vacía.

En la app, la búsqueda la hace \`PosApp\` con el hook \`useProductSearch\` (\`src/hooks\`): espera 250 ms a que el cajero deje de escribir, consulta [Nutriinfo](https://www.nutriinfo.es) a través de \`/api/products\` y quita los productos sueltos, que se eligen en Frutería, Verdulería o Panadería. En estas stories, los resultados son fijos.`,
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

/** Escribir (avisa con `onQueryChange`), bajar con ↓ y añadir con Enter. */
export const SearchAndSelect: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("searchbox"))
    const input = await screen.findByRole("searchbox", {
      name: "Buscar producto",
    })
    await waitFor(() => expect(input).toHaveFocus())
    await userEvent.type(input, "an")
    await expect(args.onQueryChange).toHaveBeenLastCalledWith("an")
    await screen.findByRole("option", { name: /Arándanos/ })
    await userEvent.keyboard("{ArrowDown}{Enter}")
    await expect(args.onSelect).toHaveBeenCalledWith(products.arandanos)
  },
}

/** Buscando: se mantienen los resultados anteriores mientras llega la respuesta. */
export const Loading: Story = {
  args: { defaultOpen: true, query: "an", isLoading: true },
}

/** Si el catálogo no responde, se muestra el estado de error. */
export const SearchError: Story = {
  args: { defaultOpen: true, query: "leche", results: [], hasError: true },
  play: async () => {
    await expect(
      await screen.findByText("No se ha podido buscar")
    ).toBeInTheDocument()
  },
}
