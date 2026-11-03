import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

export type ScanNoticeProps = {
  /** Código que se está consultando. */
  ean: string
  className?: string
}

/**
 * Aviso discreto en la cabecera, en el hueco entre el logotipo y la hora, mientras se consulta
 * el código leído con la pistola (*Leyendo código…*). No tapa ni desplaza nada. Si el código no
 * existe o falla la consulta, se abre `ProductNotFoundDialog`.
 */
export function ScanNotice({ ean, className }: ScanNoticeProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex h-10 min-w-0 animate-in items-center gap-2 rounded-full bg-muted px-4 text-sm whitespace-nowrap duration-200 fade-in-0",
        className
      )}
    >
      <Loader2
        className="size-4 shrink-0 animate-spin text-muted-foreground"
        aria-hidden
      />
      <span className="font-medium">Leyendo código…</span>
      <span className="truncate font-mono text-muted-foreground">{ean}</span>
    </div>
  )
}
