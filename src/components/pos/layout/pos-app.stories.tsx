import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, screen, userEvent, waitFor, within } from "storybook/test"

import { posAppMock } from "@/mocks/pos-screen"
import { mockSearch, mockSectionCatalog } from "@/mocks/search"
import { mockDate, pausedTickets, ticketLines } from "@/mocks/tickets"

import { PosApp } from "./pos-app"

const meta = {
  title: "TPV/Pantalla/PosApp",
  component: PosApp,
  args: {
    ...posAppMock,
    date: mockDate,
    search: mockSearch,
    loadSection: mockSectionCatalog,
  },
  argTypes: {
    initialLock: {
      control: "inline-radio",
      options: ["welcome", "locked", null],
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `Aplicación completa, la que renderiza \`/\`: \`PosScreen\` con su estado más \`LockScreen\`. Es interactiva: pruébala en el lienzo.

- **Bloqueo:** empieza bloqueada con la bienvenida. El PIN \`1111\`, tecleado en el teclado físico, la desbloquea con una transición, y **Bloquear pantalla** (modal del cajero) la vuelve a bloquear. **Cerrar sesión** también lleva a la pantalla de bloqueo, con la bienvenida de una sesión nueva.
- **Ticket:** empieza **vacío**. Cada producto elegido en el buscador **se encola al final** del ticket, queda seleccionado y la lista se desplaza hasta él. Si el producto ya está, se suma 1 a su cantidad en lugar de duplicar la línea. La línea seleccionada se **despliega** para cambiar la cantidad (− / +) o eliminarla, con confirmación en la propia franja. El estado vive en el hook \`useTicket\`.
- **Secciones:** Frutería, Verdulería y Panadería abren su catálogo a pantalla completa; el producto elegido se añade al ticket.
- **Teclado numérico:** el visor muestra la cantidad de la línea seleccionada; al teclear un número y pulsar **Cantidad**, la línea pasa a esa cantidad.
- **Pausar compra:** *Pausar* pide confirmación y aparca la compra en *Clientes en pausa*; la caja queda libre. Desde *Clientes en pausa* se recupera; si hay una compra en curso, *Pausar actual y recuperar* la pausa y recupera la elegida en un toque. Al arrancar no hay ninguna compra en pausa y el botón está desactivado.
- **Mayores de 18:** el primer producto +18 (alcohol) de cada compra abre \`AgeVerificationDialog\`; si se confirma, se añade y el resto de productos +18 entran directamente. Se marcan con *+18* en el ticket.
- **Cobrar:** abre el flujo de pago (forma de pago → efectivo o tarjeta → cobro completado). *Nueva venta* vacía la caja.
- **Anular compra:** pide confirmación y vacía la caja para empezar de cero.
- **Persistencia:** con \`storageKey\`, el ticket (líneas, línea seleccionada y verificación de edad) y las compras en pausa se guardan en localStorage (\`usePersistentState\`), sobreviven a recargas y se sincronizan entre pestañas. La app usa \`storageKey="hiperssora-tpv"\`. Las demás stories no la pasan, para empezar siempre limpias.
- **Teclado físico:** escanear y teclear \`5\` + \`Enter\` deja la línea en 5 unidades; \`↑\`/\`↓\` cambian de línea; \`+\`/\`−\` suman o restan; \`Supr\` pide eliminar la línea (\`Enter\` confirma, \`Esc\` cancela); \`6\` \`*\` hace que el siguiente producto entre con cantidad 6; \`F1\` cobra, \`F2\` busca, \`F3\` añade bolsa, \`F4\` pausa, \`F5\`–\`F7\` abren Frutería, Verdulería y Panadería y \`Esc\` cancela lo que esté en marcha.
- **Bolsa:** el botón *Bolsa* añade una bolsa al carrito (si ya hay, suma 1).
- **Pistola lectora:** en cualquier momento del panel de compra, una lectura de código de barras (dígitos tecleados muy rápido + \`Enter\`) busca el EAN y mete el producto en el ticket (\`useBarcodeScanner\`). No actúa con la pantalla bloqueada ni dentro de un modal o un campo de texto. Si el código no existe o falla la consulta, abre \`ProductNotFoundDialog\` (con opción de buscar). Para simularla, haz clic en el lienzo y pega un EAN seguido de \`Enter\`; teclearlo a mano es demasiado lento para contar como lectura.`,
      },
      story: { inline: false, iframeHeight: 900 },
    },
  },
} satisfies Meta<typeof PosApp>

export default meta
type Story = StoryObj<typeof meta>

/** Inicio del turno: bloqueada con la bienvenida. */
export const FirstLogin: Story = {}

/** Flujo completo: desbloquear con 1111 y volver a bloquear desde el modal del cajero. */
export const LockFlow: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step("Desbloquear con el PIN 1111", async () => {
      await userEvent.keyboard("1111")
      await waitFor(
        () =>
          expect(canvas.queryByText(/Hola, Miquel/)).not.toBeInTheDocument(),
        { timeout: 2000 }
      )
    })

    await step("Bloquear desde el modal del cajero", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /Miquel/ }))
      await userEvent.click(
        await screen.findByRole("button", { name: "Bloquear pantalla" })
      )
      await expect(
        await canvas.findByText("Pantalla bloqueada")
      ).toBeInTheDocument()
    })
  },
}

/** Con `storageKey`: añade productos, recarga el lienzo y siguen ahí. */
export const WithPersistence: Story = {
  args: { initialLock: null, storageKey: "storybook-pos" },
}

/** Turno ya desbloqueado y con una compra en curso. */
export const WithItems: Story = {
  args: { initialLock: null, initialLines: ticketLines },
}

/** Añadir productos desde el buscador: se encolan y, si se repiten, suman cantidad. */
export const AddFromSearch: Story = {
  args: { initialLock: null },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    async function addProduct(query: string, name: RegExp) {
      await userEvent.click(
        canvas.getByRole("searchbox", { name: /Buscar por nombre/ })
      )
      const input = await screen.findByRole("searchbox", {
        name: "Buscar producto",
      })
      await waitFor(() => expect(input).toHaveFocus())
      await userEvent.type(input, query)
      await userEvent.click(await screen.findByRole("option", { name }))
    }

    await step("El ticket empieza vacío", async () => {
      await expect(
        canvas.getByText("Escanea o busca un producto para empezar")
      ).toBeInTheDocument()
    })

    await step("Se encolan en orden", async () => {
      await addProduct("leche", /Leche entera/)
      await addProduct("jam", /Jamón cocido/)
      const lines = within(
        canvas.getByRole("list", { name: "Productos del ticket" })
      ).getAllByRole("listitem")
      await expect(lines.map((line) => line.textContent)).toEqual([
        expect.stringContaining("Leche entera"),
        expect.stringContaining("Jamón cocido"),
      ])
      await expect(lines[1]).toHaveAttribute("aria-current", "true")
    })

    await step("Un producto repetido suma cantidad", async () => {
      await addProduct("leche", /Leche entera/)
      const ticket = within(
        canvas.getByRole("list", { name: "Productos del ticket" })
      )
      await expect(ticket.getAllByRole("listitem")).toHaveLength(2)
      await expect(ticket.getAllByText("2 ud")).not.toHaveLength(0)
    })
  },
}

/** Pistola: el producto entra en el ticket; un EAN desconocido abre «Producto no encontrado», que lleva al buscador. */
export const ScanBarcode: Story = {
  args: { initialLock: null },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step("Leer un EAN conocido", async () => {
      // userEvent teclea sin retardo entre teclas, como una pistola.
      await userEvent.keyboard("8410012345678{Enter}")
      await expect(
        await canvas.findByRole("button", { name: /Jamón cocido/ })
      ).toHaveAttribute("aria-expanded", "true")
    })

    await step("Leer un EAN que no existe: aviso en modal", async () => {
      await userEvent.keyboard("8400000000000{Enter}")
      await expect(
        await screen.findByRole("heading", { name: "Producto no encontrado" })
      ).toBeInTheDocument()
    })

    await step("Buscar producto abre el buscador", async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /Buscar producto/ })
      )
      await expect(
        await screen.findByRole("searchbox", { name: "Buscar producto" })
      ).toBeInTheDocument()
    })
  },
}

/** Volver a escanear un producto que ya está en el ticket suma 1 sin consultar la API. */
export const RescanBarcode: Story = {
  args: { initialLock: null, search: fn(mockSearch) },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.keyboard("8410012345678{Enter}")
    await expect(
      await canvas.findByRole("button", { name: /Jamón cocido/ })
    ).toBeInTheDocument()

    await userEvent.keyboard("8410012345678{Enter}")
    await expect(
      await canvas.findByRole("button", { name: /Jamón cocido.*2 ud/ })
    ).toBeInTheDocument()
    await expect(args.search).toHaveBeenCalledTimes(1)
  },
}

/** Editar líneas: la última añadida está desplegada; − en 1 unidad pide confirmar; tocar otra la despliega. */
export const EditLines: Story = {
  args: { initialLock: null, initialLines: ticketLines.slice(0, 3) },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const ticket = () =>
      within(canvas.getByRole("list", { name: "Productos del ticket" }))

    await step("La última línea está desplegada", async () => {
      await expect(
        canvas.getByRole("button", { name: /Cerveza rubia/ })
      ).toHaveAttribute("aria-expanded", "true")
    })

    await step("Sumar una unidad", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Sumar" }))
      await expect(ticket().getAllByText("7 ud")).not.toHaveLength(0)
    })

    await step("Desplegar otra línea: solo una a la vez", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: /Jamón cocido/ })
      )
      await expect(
        canvas.getByRole("button", { name: /Jamón cocido/ })
      ).toHaveAttribute("aria-expanded", "true")
      await expect(
        canvas.getAllByRole("button", { name: "Sumar" })
      ).toHaveLength(1)
    })

    await step("− con 1 unidad pide confirmación y elimina", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Restar" }))
      await userEvent.click(
        canvas.getByRole("button", { name: "Sí, eliminar" })
      )
      await expect(ticket().getAllByRole("listitem")).toHaveLength(2)
      await expect(
        canvas.queryByRole("button", { name: /Jamón cocido/ })
      ).not.toBeInTheDocument()
    })
  },
}

/** Teclado numérico: muestra la cantidad de la línea seleccionada y la fija con «Cantidad». */
export const SetQuantityWithNumpad: Story = {
  args: { initialLock: null, initialLines: ticketLines.slice(0, 3) },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const numpad = within(canvas.getByRole("region", { name: "Cobro" }))
    const display = () =>
      numpad.getByRole("status", { name: "Visor del teclado" })

    await step(
      "El visor muestra la cantidad de la línea seleccionada",
      async () => {
        await expect(
          numpad.getByText("Cerveza rubia lata 33 cl")
        ).toBeInTheDocument()
        await expect(display()).toHaveTextContent("6")
      }
    )

    await step(
      "Desplegar el teclado en pantalla, teclear 24 y pulsar Cantidad",
      async () => {
        const toggle = numpad.getByRole("button", { name: /Teclado/ })
        if (toggle.getAttribute("aria-expanded") !== "true")
          await userEvent.click(toggle)
        await userEvent.click(numpad.getByRole("button", { name: "2" }))
        await userEvent.click(numpad.getByRole("button", { name: "4" }))
        await expect(display()).toHaveTextContent("24")
        await userEvent.click(numpad.getByRole("button", { name: "Cantidad" }))
        await expect(
          within(
            canvas.getByRole("list", { name: "Productos del ticket" })
          ).getAllByText("24 ud")
        ).not.toHaveLength(0)
      }
    )
  },
}

/** El botón Bolsa añade una bolsa al carrito; la segunda vez suma 1. */
export const AddBag: Story = {
  args: { initialLock: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const bag = canvas.getByRole("button", { name: /Bolsa/ })
    await userEvent.click(bag)
    await userEvent.click(bag)
    const ticket = within(
      canvas.getByRole("list", { name: "Productos del ticket" })
    )
    await expect(ticket.getAllByRole("listitem")).toHaveLength(1)
    await expect(ticket.getAllByText("2 ud")).not.toHaveLength(0)
  },
}

/** Pausar la compra con confirmación y recuperarla desde «Clientes en pausa». */
export const PauseAndRestore: Story = {
  args: { initialLock: null, initialLines: ticketLines.slice(0, 2) },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const ticket = () =>
      canvas.queryByRole("list", { name: "Productos del ticket" })

    await step(
      "Al arrancar no hay nadie en pausa: botón desactivado",
      async () => {
        await expect(
          canvas.getByRole("button", { name: /Clientes en pausa/ })
        ).toBeDisabled()
      }
    )

    await step("Pausar pide confirmación y libera la caja", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /^Pausar/ }))
      await userEvent.click(
        await screen.findByRole("button", { name: "Sí, pausar" })
      )
      await waitFor(() => expect(ticket()).not.toBeInTheDocument())
      await expect(
        canvas.getByRole("button", { name: /Clientes en pausa/ })
      ).toHaveTextContent("1")
    })

    await step("Recuperar la compra desde Clientes en pausa", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: /Clientes en pausa/ })
      )
      await userEvent.click(
        await screen.findByRole("button", { name: /Ticket 0001/ })
      )
      await waitFor(() =>
        expect(within(ticket()!).getAllByRole("listitem")).toHaveLength(2)
      )
    })
  },
}

/** Con una compra a medias, «Pausar actual y recuperar» intercambia las compras en un toque. */
export const SwapWithPausedTicket: Story = {
  args: {
    initialLock: null,
    initialLines: ticketLines.slice(0, 2),
    initialPausedTickets: pausedTickets,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole("button", { name: /Clientes en pausa/ })
    )
    await userEvent.click(
      await screen.findByRole("button", { name: /Ticket 0041.*Pausar actual/ })
    )

    // Se recupera el ticket 0041 (leche y huevos)…
    const ticket = within(
      canvas.getByRole("list", { name: "Productos del ticket" })
    )
    await waitFor(() =>
      expect(ticket.getByRole("button", { name: /Leche entera/ })).toBeVisible()
    )
    await expect(
      ticket.queryByRole("button", { name: /Jamón cocido/ })
    ).not.toBeInTheDocument()

    // …y la compra que estaba en curso queda en pausa: siguen siendo dos.
    await expect(
      canvas.getByRole("button", { name: /Clientes en pausa/ })
    ).toHaveTextContent("2")
  },
}

/** El primer producto +18 pide verificar la edad; después, el resto entran directamente. */
export const AgeVerification: Story = {
  args: { initialLock: null },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const cerveza = "8410793112233{Enter}"

    await step("Rechazar: el producto no entra", async () => {
      await userEvent.keyboard(cerveza)
      await userEvent.click(
        await screen.findByRole("button", { name: "No, no añadir" })
      )
      await expect(
        canvas.getByText("Escanea o busca un producto para empezar")
      ).toBeInTheDocument()
    })

    await step("Confirmar: entra marcado como +18", async () => {
      // La pistola ignora lo que llega mientras hay un modal (aquí, cerrándose).
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await userEvent.keyboard(cerveza)
      await userEvent.click(
        await screen.findByRole("button", { name: "Sí, es mayor de 18" })
      )
      const line = await canvas.findByRole("button", { name: /Cerveza rubia/ })
      await expect(within(line).getByText("+18")).toBeInTheDocument()
    })

    await step("El segundo +18 ya no pregunta", async () => {
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await userEvent.keyboard(cerveza)
      await waitFor(() =>
        expect(
          within(
            canvas.getByRole("list", { name: "Productos del ticket" })
          ).getAllByText("2 ud")
        ).not.toHaveLength(0)
      )
      await expect(screen.queryByRole("dialog")).toBeNull()
    })
  },
}

/** Cobrar en efectivo de principio a fin: al terminar, la caja queda vacía. */
export const ChargeWithCash: Story = {
  args: { initialLock: null, initialLines: ticketLines.slice(0, 2) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: /^Cobrar/ }))
    await userEvent.click(
      await screen.findByRole("button", { name: /Efectivo/ })
    )
    await userEvent.click(await screen.findByRole("button", { name: "Exacto" }))
    await userEvent.click(
      screen.getByRole("button", { name: "Confirmar cobro" })
    )
    await userEvent.click(
      await screen.findByRole("button", { name: "Nueva venta" })
    )
    await expect(
      await canvas.findByText("Escanea o busca un producto para empezar")
    ).toBeInTheDocument()
  },
}

/** Anular la compra con confirmación: la caja queda vacía. */
export const ClearTicket: Story = {
  args: { initialLock: null, initialLines: ticketLines.slice(0, 3) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: "Anular compra" }))
    await userEvent.click(
      await screen.findByRole("button", { name: "Sí, anular compra" })
    )
    await expect(
      await canvas.findByText("Escanea o busca un producto para empezar")
    ).toBeInTheDocument()
  },
}

/** Teclado físico: escanear, «5» + Enter = 5 unidades; +/−, ↑/↓, Supr, «*», F2, F3 y Esc. */
export const KeyboardOnly: Story = {
  args: { initialLock: null },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const ticket = () =>
      within(canvas.getByRole("list", { name: "Productos del ticket" }))
    const line = (name: RegExp) => canvas.getByRole("button", { name })
    const noDialog = () =>
      waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())

    await step("Escanear leche y teclear 5 + Enter: 5 unidades", async () => {
      await userEvent.keyboard("8410128000017{Enter}")
      await waitFor(() => expect(line(/Leche entera/)).toBeInTheDocument())
      await userEvent.keyboard("5{Enter}")
      await expect(ticket().getAllByText("5 ud")).not.toHaveLength(0)
    })

    await step("+ suma y − resta una unidad", async () => {
      await userEvent.keyboard("++")
      await expect(ticket().getAllByText("7 ud")).not.toHaveLength(0)
      await userEvent.keyboard("-")
      await expect(ticket().getAllByText("6 ud")).not.toHaveLength(0)
      await userEvent.keyboard("5{Enter}")
    })

    await step("F3 añade una bolsa", async () => {
      await userEvent.keyboard("{F3}")
      await expect(line(/Bolsa reutilizable/)).toHaveAttribute(
        "aria-expanded",
        "true"
      )
    })

    await step("↑ selecciona la línea anterior", async () => {
      await userEvent.keyboard("{ArrowUp}")
      await expect(line(/Leche entera/)).toHaveAttribute(
        "aria-expanded",
        "true"
      )
    })

    await step("6 * y escanear: el producto entra con cantidad 6", async () => {
      await userEvent.keyboard("6*")
      await userEvent.keyboard("8410012345678{Enter}")
      await waitFor(() =>
        expect(line(/Jamón cocido/)).toHaveAttribute("aria-expanded", "true")
      )
      await expect(ticket().getAllByText("6 ud")).not.toHaveLength(0)
    })

    await step("Supr pide confirmación; Esc la cancela", async () => {
      await userEvent.keyboard("{Delete}")
      await expect(canvas.getByRole("alert")).toHaveTextContent("¿Eliminar")
      await userEvent.keyboard("{Escape}")
      await expect(canvas.queryByRole("alert")).toBeNull()
    })

    await step("Supr + Enter elimina la línea", async () => {
      await userEvent.keyboard("{Delete}{Enter}")
      await expect(ticket().getAllByRole("listitem")).toHaveLength(2)
    })

    await step("F5 abre Frutería y Esc la cierra", async () => {
      await userEvent.keyboard("{F5}")
      await expect(
        await screen.findByRole("heading", { name: "Frutería" })
      ).toBeInTheDocument()
      await userEvent.keyboard("{Escape}")
      await noDialog()
    })

    await step("F2 abre el buscador y Esc lo cierra", async () => {
      await userEvent.keyboard("{F2}")
      await expect(
        await screen.findByRole("searchbox", { name: "Buscar producto" })
      ).toBeInTheDocument()
      await userEvent.keyboard("{Escape}")
      await noDialog()
    })
  },
}

/** Cerrar sesión lleva a la pantalla de bloqueo, con la bienvenida. */
export const Logout: Story = {
  args: { initialLock: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole("button", { name: /Miquel/ }))
    await userEvent.click(
      await screen.findByRole("button", { name: "Cerrar sesión" })
    )
    await expect(await canvas.findByText("Hola, Miquel")).toBeInTheDocument()
  },
}

/** Sin producto seleccionado no hay franja de producto; aparece al añadir el primero. */
export const SelectedPanelAppears: Story = {
  args: { initialLock: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole("region", { name: "Producto seleccionado" })
    ).toBeNull()
    await userEvent.click(canvas.getByRole("button", { name: /Bolsa/ }))
    await expect(
      await canvas.findByRole("region", { name: "Producto seleccionado" })
    ).toHaveTextContent("Bolsa reutilizable")
  },
}
