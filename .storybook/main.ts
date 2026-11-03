import type { StorybookConfig } from "@storybook/nextjs-vite"
import tailwindcss from "@tailwindcss/vite"
import remarkGfm from "remark-gfm"

const config: StorybookConfig = {
  framework: "@storybook/nextjs-vite",
  stories: ["./docs/**/*.mdx", "../src/components/**/*.stories.@(ts|tsx)"],
  addons: [
    // remark-gfm: las páginas MDX (Introducción, Fundamentos) usan tablas de Markdown.
    {
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } },
      },
    },
    "@storybook/addon-a11y",
    // Menú de paletas de color en la barra superior (ver preview.tsx y palettes.css).
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
  ],
  staticDirs: ["../public"],
  // Next.js procesa Tailwind con Turbopack; Storybook usa Vite y necesita su propio plugin.
  viteFinal: async (viteConfig) => {
    viteConfig.plugins = [...(viteConfig.plugins ?? []), tailwindcss()]
    return viteConfig
  },
}

export default config
