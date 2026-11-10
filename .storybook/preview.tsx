import { withThemeByDataAttribute } from "@storybook/addon-themes"
import type { Preview } from "@storybook/nextjs-vite"

import { fontMono, fontSans } from "@/lib/fonts"

import "@/app/globals.css"
import "./palettes.css"

const preview: Preview = {
  tags: ["autodocs"],
  // Menú «Paleta» de la barra superior: previsualiza todo el TPV con otro color corporativo
  // (cambia --brand en <html>; las paletas están en palettes.css).
  decorators: [
    withThemeByDataAttribute({
      themes: {
        Hiperssora: "hiperssora",
        Azul: "azul",
        Verde: "verde",
        Morado: "morado",
        Naranja: "naranja",
        Grafito: "grafito",
      },
      defaultTheme: "Hiperssora",
      attributeName: "data-palette",
    }),
  ],
  // Las variables de fuente van en <html> para que también lleguen a modales y menús (portales).
  beforeAll: () => {
    document.documentElement.classList.add(fontSans.variable, fontMono.variable)
  },
  parameters: {
    layout: "centered",
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: { toc: true },
    options: {
      storySort: {
        order: [
          "Introducción",
          "Fundamentos",
          "TPV",
          [
            "Pantalla",
            "Bloqueo",
            "Cabecera",
            "Ticket",
            "Panel de cobro",
            "Secciones",
            "Pago",
            "Barra de atajos",
          ],
          "Comunes",
          "UI",
          // Fuera del sistema de diseño: la app que conecta los componentes (src/features).
          "Aplicación",
        ],
      },
    },
    a11y: {
      // 'todo': muestra las violaciones en el panel; 'error': hace fallar los tests.
      test: "todo",
    },
  },
}

export default preview
