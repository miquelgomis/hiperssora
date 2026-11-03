"use client"

import { OptionCard } from "@/components/common"
import { sections as allSections, type Section } from "@/config/sections"
import { cn } from "@/lib/utils"

export type SectionButtonsProps = {
  /** Secciones a mostrar. Por defecto, las de `@/config/sections`. */
  sections?: Section[]
  onSelect?: (section: Section) => void
  className?: string
}

/** Tres botones grandes del panel de cobro: Frutería (F5), Verdulería (F6) y Panadería (F7). */
export function SectionButtons({
  sections = allSections,
  onSelect,
  className,
}: SectionButtonsProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {sections.map((section) => (
        <OptionCard
          key={section.id}
          icon={section.icon}
          label={section.name}
          shortcutKey={section.shortcutKey}
          onClick={() => onSelect?.(section)}
        />
      ))}
    </div>
  )
}
