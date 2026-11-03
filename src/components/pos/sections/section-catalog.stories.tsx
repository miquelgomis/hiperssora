import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test"

import { products } from "@/mocks/products"
import { mockSectionCatalog } from "@/mocks/search"

import { SectionCatalog } from "./section-catalog"

const meta = {
  title: "TPV/Secciones/SectionCatalog",
  component: SectionCatalog,
  args: { load: mockSectionCatalog, onSelect: fn() },
  argTypes: { load: { control: false }, defaultSection: { control: false } },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `Flujo completo de las secciones: \`SectionButtons\` → \`SectionCatalogDialog\` → \`ScaleDialog\` (Frutería y Verdulería, al peso) o \`QuantityDialog\` (Panadería, por pieza: cuántas barras, panecillos o croissants). Panadería incluye el pan de horno suelto, que en Nutriinfo viene sin formato (\`LOOSE_BREAD_CATEGORY_IDS\`), y la bollería suelta (formato *Pieza*).

**Solo productos sueltos.** Las secciones muestran únicamente productos que se venden sueltos (formato *Pieza*, *1/2 Pieza* o *Granel*: una banana, un kiwi verde) y se venden **al peso**: al elegir uno, la báscula lo pesa y el cajero confirma con **Añadir al carrito** (entra en kilos al precio por kilo) o pulsa **Volver** para regresar al catálogo. **Nunca hay dos modales a la vez:** el catálogo se oculta mientras se pesa y, al volver, reaparece tal como estaba (misma búsqueda y mismo scroll). \`onSelect\` recibe el producto y el peso. Los **envasados** (bandeja, tarrina, malla, bolsa…: arándanos en tarrina, kiwis en bandeja) **no aparecen**: tienen su propio código de barras y entran con la pistola o el buscador. La regla está en \`isSoldLoose\` (\`src/lib/ticket.ts\`), según el formato de Nutriinfo, porque su campo \`es_granel\` marca también envases de peso variable.

**Origen de los datos:** por defecto, \`load\` es \`fetchSectionCatalog\`, que trae de [Nutriinfo](https://www.nutriinfo.es) los productos de la categoría de la sección (*Fruta*, *Verdura* y *Pan de horno*) a través de \`/api/products?category=\`. En Storybook se usa \`mockSectionCatalog\`.`,
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

    await step("Pesar y añadir al carrito", async () => {
      await userEvent.click(
        await screen.findByRole("button", { name: /Manzana golden/ })
      )
      const add = await screen.findByRole("button", {
        name: "Añadir al carrito",
      })
      await waitFor(() => expect(add).toBeEnabled(), { timeout: 3000 })

      // Volver a pesar repite la lectura: mientras pesa, no se puede añadir.
      await userEvent.click(
        screen.getByRole("button", { name: "Volver a pesar" })
      )
      await expect(add).toBeDisabled()
      await waitFor(() => expect(add).toBeEnabled(), { timeout: 3000 })
      await userEvent.click(add)

      await expect(args.onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ id: products.manzana.id, unit: "kg" }),
        expect.toSatisfy((weight: number) => weight >= 0.5 && weight <= 1.5)
      )
    })
  },
}

/** Los envasados (arándanos en tarrina) no aparecen: tienen su propio código de barras. */
export const OnlyLooseProducts: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: /Frutería/ })
    )
    await screen.findByRole("button", { name: /Plátano de Canarias/ })
    await expect(screen.queryByRole("button", { name: /Arándanos/ })).toBeNull()
  },
}

/** Panadería: elegir un croissant, decir cuántos (3) y añadir. Sin báscula. */
export const BakeryByPiece: Story = {
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
