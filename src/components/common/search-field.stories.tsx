import { type ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { fn } from "storybook/test"

import { SearchField } from "./search-field"

const meta = {
  title: "Comunes/SearchField",
  component: SearchField,
  args: {
    value: "",
    onValueChange: fn(),
    placeholder: "Buscar por nombre o código EAN",
    variant: "bar",
    isLoading: false,
  },
  argTypes: {
    variant: { control: "inline-radio", options: ["bar", "box"] },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Campo de búsqueda táctil **controlado** (`value` + `onValueChange`): lupa a la izquierda y, en cuanto hay texto, una X para borrarlo. Con `isLoading` muestra un indicador mientras se busca.\n\n- **`bar`** (por defecto): barra de borde a borde, sin esquinas y con una línea debajo, de 64 px. Es el buscador de productos: el de la pantalla principal (`SearchTrigger`, de solo lectura, con la tecla F2 a la derecha mediante `end`) y el del modal de búsqueda (`ProductSearchDialog`). Son el mismo componente.\n- **`box`**: campo con borde y esquinas redondeadas, de 56 px, dentro de una cabecera. Es el buscador del catálogo de cada sección (`SectionCatalogDialog`).\n\n **Todos los estados** reúne las dos variantes vacías, con texto y buscando.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchField>

export default meta
type Story = StoryObj<typeof meta>

/** Barra vacía, como al abrir el modal de búsqueda. */
export const Bar: Story = {}

/** Barra con texto: aparece la X para borrarlo. */
export const BarWithValue: Story = {
  args: { value: "jamón" },
}

/** Barra buscando: indicador junto a la X. */
export const BarLoading: Story = {
  args: { value: "jamón", isLoading: true },
}

/** Caja con borde, como en el catálogo de una sección. */
export const Box: Story = {
  args: { variant: "box", placeholder: "Buscar en Frutería" },
}

/** Caja con texto. */
export const BoxWithValue: Story = {
  args: { variant: "box", value: "plátano", placeholder: "Buscar en Frutería" },
}

/** Todos los estados en una sola vista. */
export const AllStates: Story = {
  name: "Todos los estados",
  render: (args) => (
    <div className="grid gap-6">
      <State label="Barra vacía">
        <SearchField {...args} />
      </State>
      <State label="Barra con texto">
        <SearchField {...args} value="jamón" />
      </State>
      <State label="Barra buscando">
        <SearchField {...args} value="jamón" isLoading />
      </State>
      <State label="Caja vacía">
        <SearchField {...args} variant="box" placeholder="Buscar en Frutería" />
      </State>
      <State label="Caja con texto">
        <SearchField
          {...args}
          variant="box"
          value="plátano"
          placeholder="Buscar en Frutería"
        />
      </State>
    </div>
  ),
}

/** Rótulo de cada estado en las galerías de estados. */
function State({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid gap-2">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </h3>
      {children}
    </section>
  )
}
