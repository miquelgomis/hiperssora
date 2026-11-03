import type { Product } from "@/types/pos"

/** Bolsa que añade «Añadir bolsa» (F3). No está en Nutriinfo: la vende la propia tienda. */
export const bagProduct: Product = {
  id: "bolsa",
  name: "Bolsa reutilizable",
  ean: "2000900000009",
  price: 0.15,
  unit: "unit",
  categoryId: "drogueria",
}
