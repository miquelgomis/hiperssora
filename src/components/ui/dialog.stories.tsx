import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { Button } from "./button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog"

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  subcomponents: {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Primitiva de shadcn/ui (Base UI): fondo gris, X de cierre, animación y cierre con `Esc` o pulsando fuera. **En el TPV no se usa directamente:** los modales se hacen con `Comunes/Modal` y las confirmaciones con `Comunes/ConfirmDialog`. Solo la usan tal cual los modales de pantalla completa con una disposición propia (catálogo de una sección y buscador).",
      },
      story: { inline: false, iframeHeight: 360 },
    },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Dialog open>
      <DialogContent className="p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¿Anular la compra?</DialogTitle>
          <DialogDescription>
            Se eliminarán todas las líneas del ticket actual.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="-mx-6 -mb-6 p-4">
          <DialogClose render={<Button variant="outline" size="xl" />}>
            Cancelar
          </DialogClose>
          <Button variant="destructive" size="xl">
            Anular
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
