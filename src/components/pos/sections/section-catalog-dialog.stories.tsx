import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor } from "storybook/test"

import { sections, type Section } from "@/config/sections"
import { isSoldLoose, toWeighedProduct, withoutFormat } from "@/lib/ticket"
import { catalog } from "@/mocks/products"

import { SectionCatalogDialog } from "./section-catalog-dialog"

const [fruteria, verduleria, panaderia] = sections
/** Lo mismo que muestra `SectionCatalog`: solo sueltos, pesados o por pieza según la sección. */
const productsOf = (section: Section) =>
  catalog
    .filter((product) => product.categoryId === section.id)
    .filter(isSoldLoose)
    .map((product) =>
      section.soldBy === "weight"
        ? toWeighedProduct(product)
        : withoutFormat(product)
    )

const meta = {
  title: "TPV/Secciones/SectionCatalogDialog",
  component: SectionCatalogDialog,
  args: {
    section: fruteria,
    products: productsOf(fruteria),
    onOpenChange: fn(),
    onSelect: fn(),
  },
  argTypes: { section: { control: false }, products: { control: false } },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Catálogo de una sección en un **modal a pantalla completa**: rejilla de `ProductTile` sobre fondo gris que **se adapta al ancho**: caben tantas columnas como permita la ventana (mínimo 176 px por producto; unas 10 a 1920 px y 6 a 1280 px), con título, número de productos y X de cierre. Arriba tiene un **buscador** que filtra al instante por nombre o por parte del EAN, para ir directo a un producto sin recorrer la rejilla.\n\n**Teclado:** al abrirse, el foco está en el **primer producto**. Las flechas `←` `→` `↑` `↓` recorren la rejilla, respetando las columnas que haya, y `Enter` pesa el producto. Escribir lleva el texto al buscador; desde el buscador, `↓` vuelve a la rejilla, y `↑` en la primera fila sube al buscador. Al volver de la báscula, el foco regresa al producto que se estaba pesando.\n\n Solo muestra productos **sueltos** (formato *Pieza*, *1/2 Pieza* o *Granel*), con su precio por kilo: los envasados tienen su propio código de barras. Al tocar uno, el catálogo se oculta y se abre `ScaleDialog` (Frutería y Verdulería, al peso, precio por kilo) o `QuantityDialog` (Panadería, por pieza, precio por unidad). Estados: cargando, con productos, vacío y error.",
      },
      story: { inline: false, iframeHeight: 820 },
    },
  },
} satisfies Meta<typeof SectionCatalogDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Fruteria: Story = {}

export const Verduleria: Story = {
  args: { section: verduleria, products: productsOf(verduleria) },
}

export const Panaderia: Story = {
  args: { section: panaderia, products: productsOf(panaderia) },
}

export const Loading: Story = {
  args: { products: [], isLoading: true },
}

export const Error: Story = {
  args: { products: [], hasError: true },
}

/** Escribir en el buscador filtra el catálogo al instante. */
export const Filtering: Story = {
  play: async () => {
    const input = await screen.findByRole("searchbox", {
      name: "Buscar en Frutería",
    })
    await userEvent.type(input, "naran")
    await expect(
      await screen.findByRole("button", { name: /Naranja de mesa/ })
    ).toBeInTheDocument()
    await expect(
      screen.queryByRole("button", { name: /Manzana golden/ })
    ).not.toBeInTheDocument()
  },
}

/** Ningún producto de la sección coincide con lo escrito. */
export const NoMatches: Story = {
  play: async () => {
    await userEvent.type(
      await screen.findByRole("searchbox", { name: "Buscar en Frutería" }),
      "sandía"
    )
  },
}

/** Teclado: foco en el primer producto, flechas para moverse y escribir para buscar. */
export const KeyboardNavigation: Story = {
  play: async () => {
    const tiles = () => screen.getAllByRole("button", { name: /€\/(kg|ud)/ })
    await waitFor(() => expect(tiles()[0]).toHaveFocus())

    await userEvent.keyboard("{ArrowRight}")
    await expect(tiles()[1]).toHaveFocus()
    await userEvent.keyboard("{ArrowLeft}")
    await expect(tiles()[0]).toHaveFocus()

    // Escribir desde la rejilla lleva al buscador.
    await userEvent.keyboard("naranja")
    const input = screen.getByRole("searchbox", { name: "Buscar en Frutería" })
    await expect(input).toHaveFocus()
    await expect(input).toHaveValue("naranja")

    // ↓ vuelve a la rejilla, ya filtrada.
    await userEvent.keyboard("{ArrowDown}")
    await expect(tiles()[0]).toHaveFocus()
    await expect(tiles()[0]).toHaveAccessibleName(/Naranja/)
  },
}
