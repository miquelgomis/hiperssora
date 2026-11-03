import Image from "next/image"
import { ShoppingBasket } from "lucide-react"

import { cn } from "@/lib/utils"

const sizes = {
  sm: { box: "size-10 rounded-lg", icon: "size-4", px: 40 },
  md: { box: "size-12 rounded-lg", icon: "size-5", px: 48 },
  lg: { box: "size-16 rounded-xl", icon: "size-6", px: 64 },
  xl: { box: "size-28 rounded-2xl", icon: "size-8", px: 112 },
} as const

export type ProductThumbnailProps = {
  /** URL de la foto. Si falta, se muestra un icono de reserva. */
  src?: string
  /** Nombre del producto, usado como texto alternativo. */
  alt: string
  size?: keyof typeof sizes
  className?: string
}

/** Miniatura cuadrada de un producto. Se usa en el ticket, el buscador y los catálogos de sección. */
export function ProductThumbnail({
  src,
  alt,
  size = "md",
  className,
}: ProductThumbnailProps) {
  const { box, icon, px } = sizes[size]

  return (
    <span
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-muted text-muted-foreground",
        box,
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          unoptimized
          className="size-full object-cover"
        />
      ) : (
        <ShoppingBasket className={icon} aria-hidden />
      )}
    </span>
  )
}
