import { PosApp } from "@/components/pos/layout"
import { cashier } from "@/config/auth"
import { bagProduct } from "@/config/products"

export default function Home() {
  return (
    <PosApp
      cashier={cashier}
      bagProduct={bagProduct}
      // Ticket y compras en pausa se guardan en localStorage: sobreviven a recargas.
      storageKey="hiperssora-tpv"
      // Para agilizar el desarrollo, la app arranca desbloqueada (sin pedir el PIN).
      initialLock={null}
    />
  )
}
