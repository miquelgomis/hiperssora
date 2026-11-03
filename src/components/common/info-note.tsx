import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type InfoNoteProps = {
  icon: LucideIcon
  children: ReactNode
  className?: string
}

/** Nota informativa dentro de un modal: icono y texto sobre el color suave de la marca. */
export function InfoNote({ icon: Icon, children, className }: InfoNoteProps) {
  return (
    <p
      role="note"
      className={cn(
        "flex items-center gap-3 rounded-xl bg-brand-soft px-4 py-3 text-sm",
        className
      )}
    >
      <Icon className="size-5 shrink-0 text-brand" aria-hidden />
      <span>{children}</span>
    </p>
  )
}
