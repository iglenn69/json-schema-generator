export interface GeneratorConfig {
  count: number;
  seed?: number;
  useSeed: boolean;
  optionalsProbability: number;
  alwaysAddFakeOf: boolean;
  failOnInvalidTypes: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  instancePath: string;
  message: string;
  keyword: string;
}

export interface GenerationResult {
  data: unknown[];
  generatedAt: string;
  schemaTitle?: string;
  count: number;
  validationResults: ValidationResult[];
  allValid: boolean;
}

export interface SavedPreset {
  id: string;
  name: string;
  schema: string;
  config: GeneratorConfig;
  createdAt: string;
}

export type OutputFormat = 'json' | 'json-array' | 'ndjson';

export type ActiveTab = 'output' | 'validation' | 'presets';
