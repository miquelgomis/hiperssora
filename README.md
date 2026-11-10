# Hiperssora · TPV

Interfaz de caja registradora (TPV) del supermercado Hiperssora: la pantalla con la que los
cajeros cobran a los clientes. Es una maqueta de frontend para escritorio con pantalla táctil y
teclado físico. El catálogo de productos es real ([Nutriinfo](https://www.nutriinfo.es)); la
báscula y el datáfono están simulados.

Next.js 16 · React 19 · Tailwind CSS 4 · shadcn/ui (Base UI) · Storybook 10

## Puesta en marcha

```bash
pnpm install
cp .env.example .env   # rellena NUTRIINFO_API_KEY
pnpm dev               # http://localhost:3000
```

El PIN de la pantalla de bloqueo es `1111`.

## Guía de componentes

`pnpm storybook` abre la guía en <http://localhost:6006>. En el despliegue está en `/storybook`.
Cada componente tiene su ficha, con documentación y sus estados, y las stories se ejecutan
también como tests.

## Scripts

| Comando             | Descripción                                |
| ------------------- | ------------------------------------------ |
| `pnpm dev`          | App en modo desarrollo                     |
| `pnpm build`        | Build de producción                        |
| `pnpm storybook`    | Guía de componentes                        |
| `pnpm test:stories` | Stories como tests (Vitest + Playwright)   |
| `pnpm lint`         | ESLint                                     |
| `pnpm typecheck`    | Comprobación de tipos                      |
| `pnpm format`       | Prettier (con orden de clases de Tailwind) |

## Estructura

```
src/
├── app/            # Next.js: la pantalla del TPV y api/products (proxy a Nutriinfo)
├── components/     # Sistema de diseño: solo interfaz (props → interfaz → callbacks)
│   ├── ui/         # Primitivas de shadcn/ui
│   ├── common/     # Componentes reutilizables (Modal, ConfirmDialog, SearchField…)
│   ├── hooks/      # Hooks de interfaz (useControllableState)
│   └── pos/        # TPV, por zonas: layout, lock, header, ticket, checkout, sections, payment, shortcuts
├── features/       # Aplicación: conecta los componentes con el estado, los datos y el hardware
│   └── pos-app/    # PosApp
├── config/         # Atajos de teclado, PIN y secciones
├── hooks/          # Estado del ticket, búsqueda, pistola lectora, báscula, persistencia… (solo features)
├── lib/            # Funciones puras: formato, totales, búsqueda, cliente de Nutriinfo
├── mocks/          # Datos de ejemplo para las stories
└── types/          # Tipos del dominio
```
