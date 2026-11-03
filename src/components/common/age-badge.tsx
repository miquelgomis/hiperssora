import { cn } from "@/lib/utils"

export type AgeBadgeProps = {
  className?: string
}

/** Distintivo «+18» de los productos que solo se venden a mayores de edad (alcohol). */
export function AgeBadge({ className }: AgeBadgeProps) {
  return (
    <span
      title="Solo para mayores de 18 años"
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-md border border-brand/40 bg-brand-soft px-1.5 text-xs font-semibold text-brand tabular-nums",
        className
      )}
    >
      +18
    </span>
  )
}
