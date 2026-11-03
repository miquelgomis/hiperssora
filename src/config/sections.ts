import { Apple, Carrot, Croissant, type LucideIcon } from "lucide-react"

import { shortcuts } from "./shortcuts"

export type Section = {
  id: "fruteria" | "verduleria" | "panaderia"
  name: string
  icon: LucideIcon
  /** Categoría de Nutriinfo de la que sale el catálogo de la sección. */
  categoryId: string
  /** Tecla que la abre (F5, F6, F7). */
  shortcutKey: string
  /**
   * Cómo se cobran sus productos sueltos: `weight`, en la báscula (fruta y verdura);
   * `unit`, por pieza (la bollería suelta de panadería, que no se pesa).
   */
  soldBy: "weight" | "unit"
}

/**
 * Secciones de producto suelto, sin código de barras, con acceso directo desde el panel de
 * cobro. Solo muestran productos sueltos (`isSoldLoose`): los envasados entran con la pistola.
 */
export const sections: Section[] = [
  {
    id: "fruteria",
    name: "Frutería",
    icon: Apple,
    shortcutKey: shortcuts.fruteria.key,
    categoryId: "b716624b-bc44-4edb-9da5-5ec47c7721a5", // Fruta y verdura › Fruta
    soldBy: "weight",
  },
  {
    id: "verduleria",
    name: "Verdulería",
    icon: Carrot,
    shortcutKey: shortcuts.verduleria.key,
    categoryId: "0a7220d1-064c-44e4-ae06-2558234367f0", // Fruta y verdura › Verdura
    soldBy: "weight",
  },
  {
    id: "panaderia",
    name: "Panadería",
    icon: Croissant,
    shortcutKey: shortcuts.panaderia.key,
    // Pan de horno suelto (LOOSE_BREAD_CATEGORY_IDS) y bollería suelta (formato Pieza).
    categoryId: "abd21442-a230-4b3b-b49a-f5afa0541b01", // Panadería y pastelería
    soldBy: "unit",
  },
]

/**
 * Subcategorías de Nutriinfo con pan de horno suelto. Ese pan viene sin formato (no «Pieza»):
 * «Barra de pan», «Pan Viena», «Panecillo de queso»… Los packs empiezan por un número
 * («3 Barras de pan») y van envasados.
 */
export const LOOSE_BREAD_CATEGORY_IDS = new Set([
  "b2299d72-801c-4f73-915e-a88cdffd62d5", // Pan de horno › Barra de pan
  "d83163a5-3a78-4b13-b21d-a7f08097ce34", // Pan de horno › Pan de bocadillo
  "e3dc4805-9140-4e1c-aedb-58d038e57c3c", // Pan de horno › Pan rebanado
])
