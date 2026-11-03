import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Info } from "lucide-react"

import { InfoNote } from "./info-note"

const meta = {
  title: "Comunes/InfoNote",
  component: InfoNote,
  args: {
    icon: Info,
    children: "Pide al cliente que acerque la tarjeta al datáfono.",
  },
  argTypes: {
    icon: { control: false },
    children: { control: "text" },
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          '**Nota informativa** dentro de un modal: icono en rojo y texto sobre el color suave de la marca (`brand-soft`). Explica algo útil para el paso en curso sin ser un error. Se anuncia como `role="note"`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InfoNote>

export default meta
type Story = StoryObj<typeof meta>

/** Nota con el icono de información. */
export const Default: Story = {}
