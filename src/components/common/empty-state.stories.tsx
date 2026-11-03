import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Loader2, ReceiptText, Search, SearchX, WifiOff } from "lucide-react"

import { EmptyState } from "./empty-state"

const meta = {
  title: "Comunes/EmptyState",
  component: EmptyState,
  args: {
    icon: Search,
    title: "Escribe para empezar a buscar",
    description: "Busca por nombre o por código EAN, completo o parcial.",
  },
  argTypes: {
    icon: { control: false },
    tone: {
      control: "inline-radio",
      options: ["brand", "destructive", "success", "neutral"],
    },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Lo que se muestra **cuando no hay contenido**: un `IconTile` (gris por defecto), un título y, si hace falta, una descripción con qué hacer. Ocupa todo el alto disponible y se centra.\n\nLo usan el ticket vacío (`TicketList`), el modal de búsqueda (`ProductSearchDialog`: vacío, buscando, sin resultados y error) y el catálogo de cada sección (`SectionCatalogDialog`).\n\n**Todos los estados** reúne en una sola vista los casos del TPV: ticket vacío, buscador vacío, buscando, sin resultados y error.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="h-80 max-w-2xl border">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

/** Ticket sin productos al empezar una compra. */
export const EmptyTicket: Story = {
  args: {
    icon: ReceiptText,
    title: "El ticket está vacío",
    description: "Pasa un producto por el lector o búscalo para empezar.",
  },
}

/** Buscando: el icono gira mientras responde la API. */
export const Loading: Story = {
  args: {
    icon: Loader2,
    iconClassName: "animate-spin",
    title: "Buscando…",
    description: undefined,
  },
}

/** La búsqueda no ha encontrado nada. */
export const NoResults: Story = {
  args: {
    icon: SearchX,
    title: "No hay resultados para «kiwi rojo»",
    description: "Prueba con otro nombre o con una parte del código EAN.",
  },
}

/** Ha fallado la consulta: tono de peligro. */
export const SearchError: Story = {
  args: {
    icon: WifiOff,
    tone: "destructive",
    title: "No se ha podido buscar",
    description: "Comprueba la conexión y vuelve a intentarlo.",
  },
}

/** Todos los estados en una sola vista. */
export const AllStates: Story = {
  name: "Todos los estados",
  decorators: [(Story) => <Story />],
  render: (args) => {
    const box = (props: Partial<typeof args>) => (
      <div className="h-64 border">
        <EmptyState {...args} {...props} />
      </div>
    )
    return (
      <div className="grid max-w-2xl gap-6">
        <State label="Ticket vacío">
          {box({
            icon: ReceiptText,
            title: "El ticket está vacío",
            description:
              "Pasa un producto por el lector o búscalo para empezar.",
          })}
        </State>
        <State label="Buscador vacío">{box({})}</State>
        <State label="Buscando">
          {box({
            icon: Loader2,
            iconClassName: "animate-spin",
            title: "Buscando…",
            description: undefined,
          })}
        </State>
        <State label="Sin resultados">
          {box({
            icon: SearchX,
            title: "No hay resultados para «kiwi rojo»",
            description:
              "Prueba con otro nombre o con una parte del código EAN.",
          })}
        </State>
        <State label="Error">
          {box({
            icon: WifiOff,
            tone: "destructive",
            title: "No se ha podido buscar",
            description: "Comprueba la conexión y vuelve a intentarlo.",
          })}
        </State>
      </div>
    )
  },
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
