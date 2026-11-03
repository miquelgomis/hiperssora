import { normalize } from "@/lib/strings"

export type HighlightMatchProps = {
  text: string
  /** Lo buscado. Sin coincidencia, el texto sale tal cual. */
  query: string
}

/** Resalta en rojo la primera coincidencia de lo buscado dentro de un texto (sin distinguir tildes). */
export function HighlightMatch({ text, query }: HighlightMatchProps) {
  const term = query.trim()
  const start = term ? normalize(text).indexOf(normalize(term)) : -1
  if (start === -1) return text

  const end = start + term.length
  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded-sm bg-brand/10 text-brand">
        {text.slice(start, end)}
      </mark>
      {text.slice(end)}
    </>
  )
}
