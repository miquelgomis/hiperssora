import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, waitFor } from "storybook/test"

import { searchProducts } from "@/lib/search"
import { catalog } from "@/mocks/products"

import { ProductSearchDialog } from "./product-search-dialog"

const meta = {
  title: "TPV/Ticket/Buscador/ProductSearchDialog",
  component: ProductSearchDialog,
  args: {
    open: true,
    query: "",
    results: [],
    onOpenChange: fn(),
    onQueryChange: fn(),
    onActiveIndexChange: fn(),
    onSelect: fn(),
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Modal de búsqueda con predictivo. Se abre **en cuanto el buscador recibe el foco**: el cajero no escribe en la pantalla principal, sino aquí.

- **Siempre se sabe que es un modal:** fondo gris, título *Buscar producto*, X de cierre y cierre al pulsar fuera o con \`Esc\`.
- **El campo ya tiene el foco** al abrirse, y los resultados se actualizan conforme se escribe. Con texto escrito aparece un botón para borrarlo.
- **Teclado:** \`↑\`/\`↓\` mueven el resultado activo, \`Enter\` lo añade y \`Esc\` cierra. La leyenda va en el pie.
- **Estados:** vacío (*Escribe para empezar a buscar*), buscando (\`isLoading\`), con resultados, sin resultados y error (\`hasError\`).

Es presentacional: el estado vive en \`ProductSearch\`.`,
      },
      story: { inline: false, iframeHeight: 760 },
    },
  },
} satisfies Meta<typeof ProductSearchDialog>

export default meta
type Story = StoryObj<typeof meta>

/** Recién abierto, sin texto. */
export const EmptyState: Story = {}

/** Búsqueda por nombre (sin distinguir tildes). */
export const ResultsByName: Story = {
  args: { query: "plat", results: searchProducts(catalog, "plat", 8) },
}

/** Búsqueda por una parte del EAN. */
export const ResultsByEan: Story = {
  args: {
    query: "2000",
    results: searchProducts(catalog, "2000", 8),
    activeIndex: 2,
  },
}

/** Primera búsqueda, esperando la respuesta del catálogo. */
export const Loading: Story = {
  args: { query: "leche", isLoading: true },
}

/** Buscando de nuevo: se mantienen los resultados anteriores mientras llega la respuesta. */
export const Refreshing: Story = {
  args: {
    query: "plata",
    results: searchProducts(catalog, "plat", 8),
    isLoading: true,
  },
}

/** La búsqueda ha fallado (sin conexión o error del catálogo). */
export const Error: Story = {
  args: { query: "leche", hasError: true },
}

export const NoResults: Story = {
  args: { query: "sandía" },
}

/** Con muchos resultados, el activo (↑/↓) se desplaza solo hasta quedar a la vista. */
export const ActiveStaysInView: Story = {
  args: {
    query: "a",
    results: searchProducts(catalog, "a", 50),
    activeIndex: searchProducts(catalog, "a", 50).length - 1,
  },
  play: async () => {
    const options = await screen.findAllByRole("option")
    const active = options.at(-1)!
    const list = document.getElementById("product-search-results")!
    await waitFor(() => {
      const item = active.getBoundingClientRect()
      const box = list.getBoundingClientRect()
      expect(item.bottom).toBeLessThanOrEqual(box.bottom + 1)
      expect(item.top).toBeGreaterThanOrEqual(box.top - 1)
    })
  },
}
