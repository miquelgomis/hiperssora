import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Input } from "./input"

const meta = {
  title: "UI/Input",
  component: Input,
  args: {
    placeholder: "Escribe algo…",
    "aria-label": "Texto",
    type: "text",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search"],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Campo de texto de shadcn/ui. En el TPV se usa a 56 px de alto (`h-14 text-base`) dentro de `ProductSearch`.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
