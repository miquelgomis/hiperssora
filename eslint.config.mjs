import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import storybook from "eslint-plugin-storybook"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...storybook.configs["flat/recommended"],
  // El sistema de diseño (src/components) es solo interfaz: recibe datos por props y avisa con
  // callbacks. Los datos, el hardware, la autenticación y el almacenamiento van en la capa que
  // lo conecta (src/features), con los hooks de src/hooks. Las stories sí pueden usar mocks.
  {
    files: ["src/components/**/*.{ts,tsx}"],
    ignores: ["src/components/**/*.stories.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/hooks", "@/hooks/*"],
              message:
                "Los componentes son solo interfaz: el estado y la lógica van en src/features. Los hooks de interfaz están en @/components/hooks.",
            },
            {
              group: [
                "@/lib/product-api",
                "@/lib/nutriinfo",
                "@/lib/scale",
                "@/lib/payment-terminal",
              ],
              message:
                "Los componentes no piden datos ni hablan con el hardware: lo recibirán por props desde src/features.",
            },
            {
              group: ["@/config/auth"],
              message:
                "Los componentes no comprueban el PIN: reciben verifyPin por props.",
            },
            {
              group: ["@/features/*", "@/mocks/*", "@/app/*"],
              message:
                "El sistema de diseño no depende de la app ni de los datos de ejemplo (solo las stories usan mocks).",
            },
          ],
        },
      ],
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message: "Los componentes no piden datos: van en src/features.",
        },
        {
          name: "localStorage",
          message: "Los componentes no guardan nada: va en src/features.",
        },
        {
          name: "sessionStorage",
          message: "Los componentes no guardan nada: va en src/features.",
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "storybook-static/**",
    "public/storybook/**",
    "next-env.d.ts",
  ]),
])

export default eslintConfig
