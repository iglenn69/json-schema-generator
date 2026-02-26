# MockForge — JSON Schema Mock Data Generator

A modern, minimal web app for generating realistic mock data from any JSON Schema. Paste or upload a schema, tune the settings, and export clean test data in seconds.

---

## Features

- **Schema Input** — paste JSON directly, drag-and-drop a `.json` file, or load a built-in example
- **Configurable Generation** — set how many objects to produce (1–10,000), control optional-field probability, and enable a reproducible seed for deterministic output
- **AJV Validation** — every generated object is validated against the original schema; per-field errors are shown with instance paths and keywords
- **Multiple Export Formats** — download as a JSON Array, Pretty JSON (one object per block), or NDJSON; copy to clipboard with one click
- **Saved Presets** — bookmark any schema + config combination to `localStorage` and reload it instantly
- **Auto-Enrich** — infers realistic `@faker-js/faker` generators automatically from property names (e.g. `email`, `createdAt`, `city`) with no manual annotations required
- **Faker annotations** — optionally use explicit `"faker": "person.fullName"` or standard `"format"` keywords to override auto-enrichment

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Mock generation | `json-schema-faker` v0.6 |
| Realistic data | `@faker-js/faker` v9 |
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
├── utils/
│   └── schemaEnricher.ts     # Infers faker annotations from property names
├── App.tsx                   # Root layout and tab routing
└── index.css                 # Global styles + CSS custom properties
```

---

## Example Schema

Click **Load Example** in the app or paste this to get started.
No manual `faker` annotations are needed — **Auto-Enrich** infers them from the property names:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User",
  "type": "object",
  "required": ["id", "firstName", "lastName", "email", "phone", "age", "createdAt"],
  "properties": {
    "id":        { "type": "integer" },
    "firstName": { "type": "string" },
    "lastName":  { "type": "string" },
    "email":     { "type": "string" },
    "phone":     { "type": "string" },
    "age":       { "type": "integer" },
    "jobTitle":  { "type": "string" },
    "username":  { "type": "string" },
    "website":   { "type": "string" },
    "createdAt": { "type": "string" },
    "updatedAt": { "type": "string" },
    "address": {
      "type": "object",
      "properties": {
        "street":  { "type": "string" },
        "city":    { "type": "string" },
        "state":   { "type": "string" },
        "country": { "type": "string" },
        "zipCode": { "type": "string" }
      }
    },
    "company": { "type": "string" },
    "bio":     { "type": "string" },
    "tags":    { "type": "array", "items": { "type": "string" }, "minItems": 1, "maxItems": 4 }
  }
}
```

---

## Auto-Enrich — Inference Rules

When **Auto-Enrich Schema** is enabled (default: on), property names are matched against 60+ patterns to inject realistic faker generators. Examples:

| Property name pattern | Generated value |
|---|---|
| `email` | Real email address |
| `firstName`, `lastName`, `fullName` | Person name |
| `phone`, `mobile` | Formatted phone number |
| `createdAt`, `updatedAt`, `timestamp` | ISO 8601 date-time |
| `birthDate`, `dob`, `startDate` | ISO 8601 date |
| `time`, `startTime` | ISO 8601 time |
| `city`, `country`, `zipCode`, `street` | Location data |
| `company`, `jobTitle` | Company / job strings |
| `username`, `website`, `url` | Internet values |
| `bio`, `description`, `content` | Lorem paragraph |
| `uuid` | UUID format |
| `age`, `price`, `rating`, `percentage` | Clamped numeric range |

Explicit `"faker"` or `"format"` annotations in the schema always take precedence over inferred values.

---

## Tips

- **Auto-Enrich** is the easiest path to realistic data — just name your properties sensibly
- Use explicit `"faker": "<category>.<method>"` to override a specific field (e.g. `"faker": "location.city"`)
- Enable **Use Seed** to produce the same dataset every run — useful for snapshot tests
- Set **Optional Fields Probability** to `1.0` to always include every optional property
- Presets are stored in `localStorage` under the key `mock-gen-presets`
