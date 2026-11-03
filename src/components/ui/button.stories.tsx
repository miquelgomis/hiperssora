import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Plus, Trash2 } from "lucide-react"
import { fn } from "storybook/test"

import { Button } from "./button"

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Botón", onClick: fn() },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "danger",
      ],
    },
    size: {
      control: "select",
      options: ["xl", "2xl", "lg", "icon-xl", "icon-lg"],
    },
  },
  parameters: {
    docs: {
      description: {
        component: `Botón de shadcn/ui (Base UI), con solo las variantes y tamaños que usa el TPV. Por defecto mide **56 px** (\`xl\`): pantalla táctil.

| Variante | Para qué |
| --- | --- |
| \`default\` | Acción principal, en el rojo de la marca: *Cobrar*, *Añadir al carrito* |
| \`outline\` | Acciones secundarias: *Cancelar*, *Volver*, − / + |
| \`secondary\` | Atajos dentro de un modal: *Exacto* |
| \`ghost\` | Botones discretos: el del cajero, *Teclado*, borrar la búsqueda |
| \`destructive\` | Acción de borrar, antes de confirmar: *Eliminar*, *Cerrar sesión* |
| \`danger\` | Lo que no se puede deshacer, ya confirmado: *Sí, eliminar*, *Sí, anular compra* |

| Tamaño | Alto | Para qué |
| --- | --- | --- |
| \`xl\` (por defecto) | 56 px | Todos los botones táctiles |
| \`2xl\` | 72 px | La acción principal (*Cobrar*) |
| \`icon-xl\` | 56 px | Solo icono: − / +, cerrar un modal |
| \`lg\`, \`icon-lg\` | 36 px | Controles secundarios dentro de otro (*Teclado*, borrar la búsqueda) |`,
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Acción principal. */
export const Default: Story = {}

/** Las seis variantes, en el tamaño táctil. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      <Button {...args}>Cobrar</Button>
      <Button {...args} variant="outline">
        Cancelar
      </Button>
      <Button {...args} variant="secondary">
        Exacto
      </Button>
      <Button {...args} variant="ghost">
        Teclado
      </Button>
      <Button {...args} variant="destructive">
        <Trash2 aria-hidden />
        Eliminar
      </Button>
      <Button {...args} variant="danger">
        <Trash2 aria-hidden />
        Sí, eliminar
      </Button>
    </div>
  ),
}

/** Los tamaños que usa el TPV. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button {...args} size="2xl">
        Cobrar
      </Button>
      <Button {...args} variant="outline">
        Volver
      </Button>
      <Button {...args} variant="outline" size="icon-xl" aria-label="Sumar">
        <Plus />
      </Button>
      <Button {...args} variant="ghost" size="lg">
        Teclado
      </Button>
    </div>
  ),
}

/** Desactivado: p. ej., *Cobrar* con el ticket vacío. */
export const Disabled: Story = { args: { disabled: true, children: "Cobrar" } }
