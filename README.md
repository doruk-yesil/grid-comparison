# Grid Comparison

Vue 3 + TypeScript application comparing nine data-grid integrations against employee data: TanStack Table, PrimeVue, RevoGrid, Grid.js, Quasar, DevExtreme, Telerik/Kendo, Syncfusion and AG Grid. The selected demo is lazy-loaded from `src/App.vue`.

## Run locally

Use a Vite 7-compatible Node.js version (Node 22.12+ recommended).

```sh
npm ci
npm run api
```

In another terminal run `npm run dev` and open Vite's printed URL. `npm run api` serves `db.json` on port 3000; demo components request `http://localhost:3000/employees`. `npm run build` performs Vue/TypeScript checking and builds `dist/`; `npm run preview` serves the build locally.

## Where to look

- `src/App.vue`: grid selector and async component mapping (TanStack is the default selection).
- `src/components/*Demo.vue`: separate integrations and their per-library configuration.
- `db.json`: shared employee demo data.
- `package.json`: grid, export and tooling dependencies; includes ExcelJS, jsPDF and file-saver.
- `src/main.ts` and `src/style.css`: app initialization and shared styling.

## Scope and limitations

Feature parity is not guaranteed across demos: inspect each component before claiming it supports the same filtering, editing or export behavior. This is an integration comparison, not a documented performance benchmark or proof that one grid is best. Some libraries require appropriate commercial/trial licensing; repository access does not grant third-party redistribution rights. Do not copy or publish license material into new documentation.

The local API is required for employee data; hosting only the static frontend does not replace it. No dedicated test script exists in `package.json`. This documentation review did not install packages, run the grids or verify the production build.

## Resuming work

Start both local processes, switch through all nine grids, and record a feature matrix plus reproducible dataset size before making a selection. Check imports against declared dependencies if a demo fails to build. Preserve evaluation decisions and known issues in this repo so they do not remain only in chat history.
