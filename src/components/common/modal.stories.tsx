import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Lock, LogOut, ScanBarcode, Search, UserRound } from "lucide-react"
import { fn } from "storybook/test"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { Modal, ModalClose, ModalTrigger } from "./modal"

const meta = {
  title: "Comunes/Modal",
  component: Modal,
  args: {
    open: true,
    onOpenChange: fn(),
    title: "Producto no encontrado",
    description:
      "Este código no está en el catálogo. Puede que se haya leído mal o que el producto no exista.",
  },
  argTypes: {
    icon: { control: false },
    media: { control: false },
    footer: { control: false },
    trigger: { control: false },
    tone: {
      control: "inline-radio",
      options: ["brand", "destructive", "success", "neutral"],
    },
    align: { control: "inline-radio", options: ["center", "start"] },
    size: { control: "inline-radio", options: ["md", "lg", "xl", "2xl"] },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `**El modal del TPV.** Todos los modales de la app se construyen con él (salvo los de pantalla completa, como el catálogo de una sección o el buscador), así que comparten medidas, márgenes, tipografía y pie de botones. Para las confirmaciones «¿Seguro que…?» está \`ConfirmDialog\`, que es un \`Modal\` ya montado.

| Pieza | Prop | Notas |
| --- | --- | --- |
| Título y descripción | \`title\`, \`description\` | Título de modal (20 px) y cuerpo en gris |
| Icono | \`icon\` + \`tone\` | Baldosa de 64 px: \`brand\`, \`destructive\`, \`success\` o \`neutral\` |
| Imagen | \`media\` | En lugar del icono: foto del producto, avatar… |
| Cifra protagonista | \`figure\` | Bajo la descripción, en grande (p. ej., el total) |
| Contenido | \`children\` | Lo propio de cada modal |
| Botones | \`footer\` | De borde a borde, separados por una línea; de 56 px |

**Dos disposiciones:** \`center\` (por defecto) para avisos y confirmaciones, y \`start\` para formularios y listas (báscula, efectivo, clientes en pausa), con la imagen a la izquierda del título.

**Cierre:** siempre con \`Esc\` o pulsando fuera. Los modales de **elección** llevan además la X (\`showCloseButton\`); los que tienen botones en el pie, no, porque ya hay un *Cancelar* o *Volver*.

**Abrir:** controlado con \`open\` / \`onOpenChange\`, o con un botón propio en \`trigger\` (\`ModalTrigger\`). \`ModalClose\` cierra el modal desde cualquier botón.

Debajo está la primitiva \`UI/Dialog\` (Base UI), que no se usa directamente en el TPV.`,
      },
      story: { inline: false, iframeHeight: 560 },
    },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

const footer = (
  <>
    <ModalClose render={<Button variant="outline" size="xl" />}>
      Cerrar
    </ModalClose>
    <Button size="xl">
      <Search aria-hidden />
      Buscar producto
    </Button>
  </>
)

/** Aviso con icono, contenido y botones: la forma más habitual. */
export const WithActions: Story = {
  args: {
    icon: ScanBarcode,
    footer,
    children: (
      <p className="rounded-xl bg-muted/50 px-5 py-4 text-center font-mono text-2xl tracking-wider">
        8400000000000
      </p>
    ),
  },
}

/** Tonos del icono: `destructive` para errores y lo que no se puede deshacer. */
export const Destructive: Story = {
  args: { ...WithActions.args, tone: "destructive" },
}

/** Con cifra protagonista, como la forma de pago o el cobro completado. */
export const WithFigure: Story = {
  args: {
    title: "Cobrar",
    description: "Selecciona la forma de pago",
    figure: "23,45 €",
    footer: (
      <ModalClose render={<Button variant="outline" size="xl" />}>
        Cancelar
      </ModalClose>
    ),
  },
}

/** De elección: sin pie y con X, como el del cajero. Se abre con su propio botón. */
export const Choice: Story = {
  args: {
    open: undefined,
    defaultOpen: true,
    showCloseButton: true,
    title: "Miquel Gomis",
    description: "Caja 3",
    media: (
      <Avatar size="lg" className="size-16 text-lg">
        <AvatarFallback>MG</AvatarFallback>
      </Avatar>
    ),
    trigger: (
      <ModalTrigger render={<Button variant="outline" size="xl" />}>
        <UserRound aria-hidden />
        Abrir
      </ModalTrigger>
    ),
    children: (
      <div className="grid gap-2">
        <ModalClose render={<Button variant="outline" size="xl" />}>
          <Lock aria-hidden />
          Bloquear pantalla
        </ModalClose>
        <ModalClose render={<Button variant="destructive" size="xl" />}>
          <LogOut aria-hidden />
          Cerrar sesión
        </ModalClose>
      </div>
    ),
  },
}

/** Alineado a la izquierda, para formularios y listas. */
export const AlignStart: Story = {
  args: {
    align: "start",
    size: "lg",
    showCloseButton: true,
    title: "Clientes en pausa",
    description: "Elige la compra que quieres recuperar en la caja",
    children: (
      <div className="flex h-20 items-center rounded-xl border px-4 text-base font-medium">
        Ticket 0001
      </div>
    ),
  },
}
