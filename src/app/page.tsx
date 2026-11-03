import { PosApp } from "@/components/pos/layout"
import { posAppMock } from "@/mocks/pos-screen"

export default function Home() {
  return (
    <PosApp
      {...posAppMock}
      // Ticket y compras en pausa se guardan en localStorage: sobreviven a recargas.
      storageKey="hiperssora-tpv"
      // Para agilizar el desarrollo, la app arranca desbloqueada (sin pedir el PIN).
      initialLock={null}
    />
  )
}
