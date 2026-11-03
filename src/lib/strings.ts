/** Devuelve hasta dos iniciales en mayúsculas: "Miquel Gomis" → "MG". */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
}

/** Normaliza para comparar sin mayúsculas ni tildes: "Plátano" → "platano". */
export function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
}

/** "Miquel Gomis" → "Miquel" */
export function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? ""
}
