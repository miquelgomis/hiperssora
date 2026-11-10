import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test"

import { sections, type Section } from "@/config/sections"
import { toSectionProducts } from "@/lib/ticket"
import { catalog, products } from "@/mocks/products"

import { SectionCatalog } from "./section-catalog"

/** Catálogo de ejemplo de una sección, tal como lo prepara la app (solo sueltos). */
function sectionProducts(sectionId: Section["id"]) {
  const section = sections.find(({ id }) => id === sectionId)!
  return toSectionProducts(
    section,
    catalog.filter((product) => product.categoryId === sectionId)
  )
}

const meta = {
  title: "TPV/Secciones/SectionCatalog",
  component: SectionCatalog,
  args: {
    products: sectionProducts("fruteria"),
    weight: 0.85,
    onSelect: fn(),
    onReweigh: fn(),
  },
  argTypes: {
    products: { control: false },
    defaultSection: { control: false },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Flujo completo de las secciones: \`SectionButtons\` → \`SectionCatalogDialog\` → \`ScaleDialog\` (Frutería y Verdulería, al peso) o \`QuantityDialog\` (Panadería, por pieza: cuántas barras, panecillos o croissants).

**Es solo interfaz.** No carga el catálogo ni lee la báscula: muestra los \`products\` y el \`weight\` que recibe (\`SectionCatalogState\`) y avisa de lo que hace el cajero. Gestiona lo visual: qué sección está abierta, qué producto está en la báscula (\`weighing\`, que se puede controlar desde fuera) y cuántas piezas se eligen.

- **Al peso:** al elegir un producto, la báscula lo pesa y el cajero confirma con **Añadir al carrito** (entra en kilos al precio por kilo) o pulsa **Volver** para regresar al catálogo. **Volver a pesar** llama a \`onReweigh\`. \`onSelect\` recibe el producto y el peso.
- **Nunca hay dos modales a la vez:** el catálogo se oculta mientras se pesa y, al volver, reaparece tal como estaba (misma búsqueda y mismo scroll).

**En la app**, \`PosApp\` carga el catálogo de [Nutriinfo](https://www.nutriinfo.es) (\`useSectionCatalog\`, vía \`/api/products?category=\`), deja solo los productos sueltos (\`toSectionProducts\` en \`src/lib/ticket.ts\`: formato *Pieza*, *1/2 Pieza* o *Granel*, y el pan de horno suelto) y lee la báscula simulada (\`useScale\`). En estas stories, el catálogo y el peso (0,850 kg) son fijos.`,
      },
      story: { inline: false, iframeHeight: 820 },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[26rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionCatalog>

export default meta
type Story = StoryObj<typeof meta>

/** Pulsa una sección para abrir su catálogo. */
export const Default: Story = {}

/** Abrir Frutería, buscar, pesar (la báscula sustituye al catálogo), volver, volver a pesar y añadir. */
export const WeighAndAdd: Story = {
  play: async ({ args, canvasElement, step }) => {
    await step("Abrir Frutería, buscar y elegir la manzana", async () => {
      await userEvent.click(
        within(canvasElement).getByRole("button", { name: /Frutería/ })
      )
      await userEvent.type(
        await screen.findByRole("searchbox", { name: "Buscar en Frutería" }),
        "man"
      )
      await userEvent.click(
        await screen.findByRole("button", { name: /Manzana golden/ })
      )
    })

    await step(
      "La báscula sustituye al catálogo: nunca dos modales",
      async () => {
        await expect(
          await screen.findByRole("button", { name: "Volver a pesar" })
        ).toBeInTheDocument()
        await waitFor(() =>
          expect(screen.getAllByRole("dialog")).toHaveLength(1)
        )
      }
    )

    await step("Volver reabre el catálogo tal como estaba", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Volver" }))
      await expect(
        await screen.findByRole("searchbox", { name: "Buscar en Frutería" })
      ).toHaveValue("man")
      // El foco vuelve al producto que se estaba pesando.
      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: /Manzana golden/ })
        ).toHaveFocus()
      )
      await waitFor(() => expect(screen.getAllByRole("dialog")).toHaveLength(1))
      await expect(args.onSelect).not.toHaveBeenCalled()
    })

    await step("Volver a pesar y añadir al carrito", async () => {
      await userEvent.click(
        await screen.findByRole("button", { name: /Manzana golden/ })
      )
      await userEvent.click(
        await screen.findByRole("button", { name: "Volver a pesar" })
      )
      await expect(args.onReweigh).toHaveBeenCalledOnce()
      const add = screen.getByRole("button", { name: "Añadir al carrito" })
      await waitFor(() => expect(add).toBeEnabled())
      await userEvent.click(add)

      await expect(args.onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: products.manzana.id, unit: "kg" }),
        0.85
      )
    })
  },
}

/** Mientras la báscula se estabiliza (`weight` nulo), no se puede añadir. */
export const Weighing: Story = {
  args: { weight: null },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: /Frutería/ })
    )
    await userEvent.click(
      await screen.findByRole("button", { name: /Manzana golden/ })
    )
    await expect(await screen.findByText("Pesando…")).toBeInTheDocument()
    await expect(
      screen.getByRole("button", { name: "Añadir al carrito" })
    ).toBeDisabled()
  },
}

/** Los envasados (arándanos en tarrina) no llegan al catálogo: tienen su propio código de barras. */
export const OnlyLooseProducts: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: /Frutería/ })
    )
    await screen.findByRole("button", { name: /Plátano de Canarias/ })
    await expect(screen.queryByRole("button", { name: /Arándanos/ })).toBeNull()
  },
}

/** Catálogo cargando. */
export const Loading: Story = {
  args: { products: [], isLoading: true, defaultSection: sections[0] },
}

/** El catálogo no se ha podido cargar. */
export const LoadError: Story = {
  args: { products: [], hasError: true, defaultSection: sections[0] },
}

/** Panadería: elegir un croissant, decir cuántos (3) y añadir. Sin báscula. */
export const BakeryByPiece: Story = {
  args: { products: sectionProducts("panaderia") },
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: /Panadería/ })
    )
    await userEvent.click(
      await screen.findByRole("button", { name: /Croissant/ })
    )
    await expect(
      await screen.findByRole("status", { name: "Cantidad" })
    ).toHaveTextContent("1")
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Añadir al carrito" })
      ).toHaveFocus()
    )
    await userEvent.keyboard("3{Enter}")
    await expect(args.onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: products.croissant.id,
        name: "Croissant de mantequilla",
      }),
      3
    )
    await expect(screen.queryByText("Pesando…")).toBeNull()
  },
}
