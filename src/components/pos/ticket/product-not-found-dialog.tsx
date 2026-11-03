"use client"

import { useRef } from "react"
import { RotateCw, Search, ScanBarcode, WifiOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Modal, ModalClose } from "@/components/common"

import { ScannedCode } from "./scanned-code"

const CONTENT = {
  "not-found": {
    icon: ScanBarcode,
    title: "Producto no encontrado",
    description:
      "Este código no está en el catálogo. Puede que se haya leído mal o que el producto no exista. Búscalo por su nombre.",
    tone: "brand",
  },
  error: {
    icon: WifiOff,
    title: "No se ha podido comprobar el código",
    description:
      "Ha fallado la consulta al catálogo. Vuelve a intentarlo o busca el producto por su nombre.",
    tone: "destructive",
  },
} as const

export type ProductNotFoundDialogProps = {
  /** Código leído y por qué no se ha podido añadir. Con `null`, cerrado. */
  status: { state: keyof typeof CONTENT; ean: string } | null
  /** "Buscar producto": abre el buscador para encontrarlo por su nombre. */
  onSearch?: () => void
  /** "Reintentar" (solo si falló la consulta). */
  onRetry?: () => void
  onClose?: () => void
}

/**
 * Aviso cuando la pistola lee un código que **no existe** en el catálogo (o mal leído), o cuando
 * **falla la consulta**. Ofrece buscar el producto por su nombre; si falló la consulta, también
 * reintentar. Teclado: el foco empieza en *Buscar producto* (Enter) y Esc cierra.
 */
export function ProductNotFoundDialog({
  status,
  onSearch,
  onRetry,
  onClose,
}: ProductNotFoundDialogProps) {
  const searchButtonRef = useRef<HTMLButtonElement>(null)
  const content = status ? CONTENT[status.state] : null

  return (
    <Modal
      open={status !== null}
      onOpenChange={(open) => !open && onClose?.()}
      icon={content?.icon}
      tone={content?.tone}
      title={content?.title}
      description={content?.description}
      initialFocus={searchButtonRef}
      finalFocus={false}
      footer={
        <>
          <ModalClose render={<Button variant="outline" size="xl" />}>
            Cerrar
          </ModalClose>
          {status?.state === "error" && (
            <Button variant="outline" size="xl" onClick={onRetry}>
              <RotateCw aria-hidden />
              Reintentar
            </Button>
          )}
          <Button ref={searchButtonRef} size="xl" onClick={onSearch}>
            <Search aria-hidden />
            Buscar producto
          </Button>
        </>
      }
    >
      {status && <ScannedCode ean={status.ean} />}
    </Modal>
  )
}
