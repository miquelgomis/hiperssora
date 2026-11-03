import Image from "next/image"

const VARIANTS = {
  // 44 px de alto: proporcionado a la cabecera de 80 px. El SVG horizontal es 512 × 111.
  horizontal: { src: "/brand/brand-logo.svg", width: 203, height: 44 },
  mark: { src: "/brand/brand-squared.svg", width: 44, height: 44 },
} as const

export type LogoProps = {
  /** `horizontal`: logotipo completo (cabecera). `mark`: solo el isotipo cuadrado. */
  variant?: keyof typeof VARIANTS
  className?: string
}

/** Logotipo de Hiperssora. Los SVG están en `public/brand/`. */
export function Logo({ variant = "horizontal", className }: LogoProps) {
  const { src, width, height } = VARIANTS[variant]

  return (
    <Image
      src={src}
      alt="Hiperssora"
      width={width}
      height={height}
      priority
      className={className}
    />
  )
}
