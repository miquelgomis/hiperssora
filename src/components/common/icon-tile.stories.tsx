import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { CircleCheck, Loader2, ScanBarcode, Search, Trash2 } from "lucide-react"

import { IconTile } from "./icon-tile"

const meta = {
  title: "Comunes/IconTile",
  component: IconTile,
  args: {
    icon: ScanBarcode,
    tone: "brand",
    size: "lg",
  },
  argTypes: {
    icon: { control: false },
    tone: {
      control: "inline-radio",
      options: ["brand", "destructive", "success", "neutral"],
    },
    size: { control: "inline-radio", options: ["md", "lg"] },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Icono de Lucide dentro de una **baldosa de color** con las esquinas redondeadas. Encabeza los modales (`Modal`), los estados vacíos (`EmptyState`) y el catálogo de cada sección (`SectionCatalogDialog`).\n\n- **Tonos** (`tone`): `brand` (rojo suave, por defecto), `destructive` (borrar, error), `success` (cobro completado) y `neutral` (gris, estados vacíos).\n- **Tamaños** (`size`): `md` (56 px), en cabeceras, y `lg` (64 px), en modales y estados vacíos.\n- `iconClassName` anima el icono, p. ej. `animate-spin` mientras se carga.\n\n**Todos los estados** reúne tonos y tamaños en una sola vista.",
      },
    },
  },
} satisfies Meta<typeof IconTile>

export default meta
type Story = StoryObj<typeof meta>

/** Tono de la marca: el de la mayoría de los modales. */
export const Brand: Story = {}

/** Peligro: eliminar, anular o un error. */
export const Destructive: Story = {
  args: { tone: "destructive", icon: Trash2 },
}

/** Éxito: cobro completado. */
export const Success: Story = {
  args: { tone: "success", icon: CircleCheck },
}

/** Neutro, en gris: estados vacíos. */
export const Neutral: Story = {
  args: { tone: "neutral", icon: Search },
}

/** Tamaño mediano (56 px), para cabeceras. */
export const Medium: Story = {
  args: { size: "md" },
}

/** Cargando: el icono gira con `iconClassName="animate-spin"`. */
export const Loading: Story = {
  args: { tone: "neutral", icon: Loader2, iconClassName: "animate-spin" },
}

/** Todos los estados en una sola vista. */
export const AllStates: Story = {
  name: "Todos los estados",
  render: (args) => (
    <div className="grid gap-6">
      <State label="Tonos (lg, 64 px)">
        <div className="flex gap-4">
          <IconTile {...args} tone="brand" icon={ScanBarcode} />
          <IconTile {...args} tone="destructive" icon={Trash2} />
          <IconTile {...args} tone="success" icon={CircleCheck} />
          <IconTile {...args} tone="neutral" icon={Search} />
        </div>
      </State>
      <State label="Tonos (md, 56 px)">
        <div className="flex gap-4">
          <IconTile {...args} size="md" tone="brand" icon={ScanBarcode} />
          <IconTile {...args} size="md" tone="destructive" icon={Trash2} />
          <IconTile {...args} size="md" tone="success" icon={CircleCheck} />
          <IconTile {...args} size="md" tone="neutral" icon={Search} />
        </div>
      </State>
      <State label="Cargando">
        <IconTile
          {...args}
          tone="neutral"
          icon={Loader2}
          iconClassName="animate-spin"
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
