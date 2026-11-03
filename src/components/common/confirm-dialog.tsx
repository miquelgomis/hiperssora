"use client"

import { useRef, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Modal, ModalClose, type ModalProps } from "./modal"

export type ConfirmDialogProps = {
  open: boolean
  /** Se llama con `false` al cancelar (botón, `Esc` o pulsando fuera). */
  onOpenChange?: (open: boolean) => void
  icon: LucideIcon
  /** `destructive` para lo que no se puede deshacer: icono y botón de confirmar en rojo. */
  tone?: "brand" | "destructive"
  /** La pregunta: «¿Pausar la compra?». */
  title: ReactNode
  /** Qué pasará si se confirma. */
  description?: ReactNode
  /** Sobre qué se actúa: resumen de la compra, producto… (p. ej., `SummaryRow`). */
  children?: ReactNode
  /** Botón de confirmar, en positivo: «Sí, pausar». */
  confirmLabel: ReactNode
  confirmIcon?: LucideIcon
  onConfirm?: () => void
  cancelLabel?: ReactNode
  /**
   * Botón enfocado al abrir. `cancel` (por defecto): un `Enter` despistado no confirma; para lo
   * que no se puede deshacer. `confirm`: `Enter` confirma; para preguntas rutinarias (+18).
   */
  defaultFocus?: "cancel" | "confirm"
  /** Ancho (ver `Modal`). Por defecto, `md`. */
  size?: ModalProps["size"]
}

/**
 * Confirmación «¿Seguro que…?» antes de una acción importante. Es un `Modal` centrado, sin X:
 * icono, pregunta, qué pasará, sobre qué se actúa y dos botones, *Cancelar* y la acción. Por
 * defecto, *Cancelar* está enfocado al abrir, así que un `Enter` despistado no confirma; con
 * `defaultFocus="confirm"`, `Enter` confirma.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  icon,
  tone = "brand",
  title,
  description,
  children,
  confirmLabel,
  confirmIcon: ConfirmIcon,
  onConfirm,
  cancelLabel = "Cancelar",
  size,
  defaultFocus = "cancel",
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      initialFocus={defaultFocus === "confirm" ? confirmRef : cancelRef}
      size={size}
      icon={icon}
      tone={tone}
      title={title}
      description={description}
      footer={
        <>
          <ModalClose
            ref={cancelRef}
            render={<Button variant="outline" size="xl" />}
          >
            {cancelLabel}
          </ModalClose>
          <Button
            ref={confirmRef}
            size="xl"
            onClick={onConfirm}
            variant={tone === "destructive" ? "danger" : "default"}
          >
            {ConfirmIcon && <ConfirmIcon aria-hidden />}
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  )
}
