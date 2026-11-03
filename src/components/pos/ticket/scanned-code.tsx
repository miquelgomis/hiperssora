export type ScannedCodeProps = {
  /** Código leído. */
  ean: string
}

/** Código de barras leído, en grande y con cifras espaciadas, para comprobarlo de un vistazo. */
export function ScannedCode({ ean }: ScannedCodeProps) {
  return (
    <p className="rounded-xl bg-muted/50 px-5 py-4 text-center font-mono text-2xl tracking-wider">
      {ean}
    </p>
  )
}
