# MockForge — JSON Schema Mock Data Generator

A modern, minimal web app for generating realistic mock data from any JSON Schema. Paste or upload a schema, tune the settings, and export clean test data in seconds.

---

## Features

- **Schema Input** — paste JSON directly, drag-and-drop a `.json` file, or load a built-in example
- **Configurable Generation** — set how many objects to produce (1–10,000), control optional-field probability, and enable a reproducible seed for deterministic output
- **AJV Validation** — every generated object is validated against the original schema; per-field errors are shown with instance paths and keywords
- **Multiple Export Formats** — download as a JSON Array, Pretty JSON (one object per block), or NDJSON; copy to clipboard with one click
- **Saved Presets** — bookmark any schema + config combination to `localStorage` and reload it instantly
- **Faker annotations** — use `"faker": "person.fullName"` and standard `"format"` keywords for realistic, domain-specific values

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Mock generation | `json-schema-faker` v0.6 |
| Validation | `ajv` v8 |
| Icons | `lucide-react` |

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Install & run

```bash
cd mock-data-generator
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other scripts

```bash
npm run build      # Production build → dist/
npm run preview    # Serve the production build locally
npm run lint       # ESLint check
```

---

## Project Structure

```
src/
├── components/
│   ├── SchemaEditor.tsx      # JSON input with file upload & drag-and-drop
│   ├── GeneratorConfig.tsx   # Count, seed, and options panel
│   ├── OutputViewer.tsx      # Results browser + download controls
│   ├── ValidationPanel.tsx   # AJV validation report
│   └── PresetsPanel.tsx      # Save / load presets (localStorage)
├── hooks/
│   └── useSchemaGenerator.ts # Core generation & state logic
├── types/
│   └── schema.ts             # Shared TypeScript interfaces
├── App.tsx                   # Root layout and tab routing
└── index.css                 # Global styles + CSS custom properties
```

---

## Example Schema

Click **Load Example** in the app or paste this to get started:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User",
  "type": "object",
  "required": ["id", "name", "email", "age"],
  "properties": {
    "id":    { "type": "integer", "minimum": 1 },
    "name":  { "type": "string", "faker": "person.fullName" },
    "email": { "type": "string", "format": "email" },
    "age":   { "type": "integer", "minimum": 18, "maximum": 80 },
    "tags":  { "type": "array", "items": { "type": "string", "faker": "word.noun" }, "minItems": 1, "maxItems": 4 }
  }
}
```

---

## Tips

- Use `"faker": "<category>.<method>"` for realistic values (e.g. `"location.city"`, `"internet.url"`)
- Enable **Use Seed** to produce the same dataset every run — useful for snapshot tests
- Set **Optional Fields Probability** to `1.0` to always include every optional property
- Presets are stored in `localStorage` under the key `mock-gen-presets`

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
