# MockForge – JSON Schema Mock Data Generator

A React + TypeScript + Vite application for generating realistic mock data from JSON schemas.

## Architecture

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`)
- **Mock generation**: `json-schema-faker`
- **Validation**: `ajv`
- **Icons**: `lucide-react`

## Key Files

- `src/hooks/useSchemaGenerator.ts` – core state and generation logic
- `src/types/schema.ts` – TypeScript interfaces
- `src/components/SchemaEditor.tsx` – JSON schema input with file upload
- `src/components/GeneratorConfig.tsx` – count, seed, options
- `src/components/OutputViewer.tsx` – results with download
- `src/components/ValidationPanel.tsx` – AJV validation display
- `src/components/PresetsPanel.tsx` – save/load schema presets (localStorage)

## Dev Guidelines

- Use CSS variables defined in `index.css` for colors (dark theme)
- Presets are stored in `localStorage` under key `mock-gen-presets`
- The seeded RNG uses mulberry32 algorithm for reproducible output
