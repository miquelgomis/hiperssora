"use client"

import type { ComponentProps, ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { IconTile, type IconTone } from "./icon-tile"

/** Color del icono (ver `IconTile`). */
export type ModalTone = IconTone

const SIZES = {
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
}

type ContentProps = ComponentProps<typeof DialogContent>

export type ModalProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Botón que abre el modal (`ModalTrigger`), si no se controla con `open`. */
  trigger?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Icono en una baldosa de color, sobre el título (o a su izquierda con `align="start"`). */
  icon?: LucideIcon
  tone?: ModalTone
  /** Clases extra del icono (p. ej., `animate-pulse` mientras se espera). */
  iconClassName?: string
  /** Imagen en lugar del icono: foto del producto, avatar… */
  media?: ReactNode
  /** Cifra protagonista bajo la descripción (p. ej., el total a cobrar). */
  figure?: ReactNode
  /** `center`: avisos y confirmaciones. `start`: formularios y listas. */
  align?: "center" | "start"
  /** Ancho máximo: `md` (448 px), `lg` (512 px), `xl` (576 px) o `2xl` (672 px). */
  size?: keyof typeof SIZES
  /** X de cierre. Sin ella, el modal se cierra con los botones del pie, `Esc` o pulsando fuera. */
  showCloseButton?: boolean
  /** Botones del pie, de borde a borde y separados del contenido. */
  footer?: ReactNode
  children?: ReactNode
  /** Elemento enfocado al abrir. Por defecto, el primero que se puede enfocar. */
  initialFocus?: ContentProps["initialFocus"]
  /** Elemento enfocado al cerrar. `false`: ninguno. */
  finalFocus?: ContentProps["finalFocus"]
  /** Mantiene el contenido (y su estado) al cerrar. */
  keepMounted?: boolean
  onKeyDown?: ContentProps["onKeyDown"]
  className?: string
}

/**
 * Modal del TPV. Todos los modales de la app (salvo los de pantalla completa) se construyen con
 * él, así que comparten medidas, márgenes, tipografía y pie de botones. Sobre `ui/Dialog`: fondo
 * gris, cierre con `Esc` o pulsando fuera y la misma animación.
 */
export function Modal({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  icon: Icon,
  tone = "brand",
  iconClassName,
  media,
  figure,
  align = "center",
  size = "md",
  showCloseButton = false,
  footer,
  children,
  initialFocus,
  finalFocus,
  keepMounted,
  onKeyDown,
  className,
}: ModalProps) {
  const isCentered = align === "center"
  const visual =
    media ??
    (Icon && <IconTile icon={Icon} tone={tone} className={iconClassName} />)

  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger}
      <DialogContent
        showCloseButton={showCloseButton}
        initialFocus={initialFocus}
        finalFocus={finalFocus}
        keepMounted={keepMounted}
        onKeyDown={onKeyDown}
        // minmax(0, 1fr): un texto largo (p. ej., el nombre de un producto) se corta en lugar de
        // ensanchar el modal y desbordarlo.
        className={cn(
          "grid-cols-[minmax(0,1fr)] gap-6 p-6",
          SIZES[size],
          className
        )}
      >
        <DialogHeader
          className={cn(
            isCentered
              ? "items-center pt-2 text-center"
              : visual && "flex-row items-center gap-4",
            // Deja sitio a la X.
            showCloseButton && !isCentered && "pr-12"
          )}
        >
          {visual && <div className={cn(isCentered && "mb-2")}>{visual}</div>}
          <div
            className={cn(
              "flex min-w-0 flex-col gap-2",
              isCentered && "items-center"
            )}
          >
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
            {figure !== undefined && (
              <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums">
                {figure}
              </p>
            )}
          </div>
        </DialogHeader>

        {children}

        {footer && (
          <DialogFooter className="-mx-6 -mb-6 p-4">{footer}</DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

/** Botón que abre un `Modal` (va en su prop `trigger`). */
export const ModalTrigger = DialogTrigger

/** Botón que cierra el `Modal` en el que está (p. ej., *Cancelar*). */
export const ModalClose = DialogClose
