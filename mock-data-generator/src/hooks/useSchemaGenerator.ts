import { useState, useCallback } from 'react';
import { generate as jsf } from 'json-schema-faker';
import { faker } from '@faker-js/faker';
import Ajv from 'ajv';
import type { GeneratorConfig, GenerationResult, SavedPreset, OutputFormat, ValidationResult } from '../types/schema';
import type { JsonSchema } from 'json-schema-faker';
import { enrichSchema } from '../utils/schemaEnricher';

const ajv = new Ajv({ allErrors: true });

const DEFAULT_CONFIG: GeneratorConfig = {
  count: 10,
  seed: 42,
  useSeed: false,
  optionalsProbability: 0.5,
  alwaysAddFakeOf: true,
  failOnInvalidTypes: false,
  autoEnrich: true,
};

const STORAGE_KEY = 'mock-gen-presets';

function loadPresets(): SavedPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePresetsToStorage(presets: SavedPreset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function useSchemaGenerator() {
  const [schemaText, setSchemaText] = useState('');
  const [config, setConfig] = useState<GeneratorConfig>(DEFAULT_CONFIG);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [presets, setPresets] = useState<SavedPreset[]>(loadPresets);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('json-array');

  const generate = useCallback(async () => {
    setError(null);
    setIsGenerating(true);

    try {
      let schema: JsonSchema;
      try {
        const parsed = JSON.parse(schemaText);
        schema = (config.autoEnrich ? enrichSchema(parsed) : parsed) as JsonSchema;
      } catch {
        throw new Error('Invalid JSON schema: could not parse JSON.');
      }

      if (config.useSeed && config.seed !== undefined) {
        faker.seed(config.seed);
      }

      const jsfOptions = {
        optionalsProbability: config.optionalsProbability,
        useDefaultValue: true,
        extensions: { faker },
        ...(config.useSeed && config.seed !== undefined ? { seed: config.seed } : {}),
      };

      const data: unknown[] = [];
      for (let i = 0; i < config.count; i++) {
        const item = await jsf(schema, jsfOptions);
        data.push(item);
      }

      // Validate each generated object
      let validateFn: ReturnType<typeof ajv.compile> | null = null;
      try {
        validateFn = ajv.compile(schema as object);
      } catch {
        // Schema might have features not supported by ajv
      }

      const validationResults: ValidationResult[] = data.map((item) => {
        if (!validateFn) return { valid: true, errors: [] };
        const valid = validateFn(item) as boolean;
        return {
          valid,
          errors: (validateFn.errors ?? []).map((e) => ({
            instancePath: e.instancePath,
            message: e.message ?? 'Unknown error',
            keyword: e.keyword,
          })),
        };
      });

      const schemaObj = schema as Record<string, unknown>;
      const schemaTitle = typeof schemaObj.title === 'string' ? schemaObj.title : undefined;

      setResult({
        data,
        generatedAt: new Date().toISOString(),
        schemaTitle,
        count: data.length,
        validationResults,
        allValid: validationResults.every((r) => r.valid),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGenerating(false);
    }
  }, [schemaText, config]);

  const savePreset = useCallback(
    (name: string) => {
      const preset: SavedPreset = {
        id: crypto.randomUUID(),
        name,
        schema: schemaText,
        config,
        createdAt: new Date().toISOString(),
      };
      const updated = [...presets, preset];
      setPresets(updated);
      savePresetsToStorage(updated);
    },
    [schemaText, config, presets]
  );

  const loadPreset = useCallback(
    (preset: SavedPreset) => {
      setSchemaText(preset.schema);
      setConfig(preset.config);
    },
    []
  );

  const deletePreset = useCallback(
    (id: string) => {
      const updated = presets.filter((p) => p.id !== id);
      setPresets(updated);
      savePresetsToStorage(updated);
    },
    [presets]
  );

  const downloadResult = useCallback(
    (format: OutputFormat) => {
      if (!result) return;
      let content = '';
      let filename = '';
      let mimeType = 'application/json';

      if (format === 'json-array') {
        content = JSON.stringify(result.data, null, 2);
        filename = 'mock-data.json';
      } else if (format === 'json') {
        content = result.data.map((item) => JSON.stringify(item, null, 2)).join('\n\n');
        filename = 'mock-data.json';
      } else if (format === 'ndjson') {
        content = result.data.map((item) => JSON.stringify(item)).join('\n');
        filename = 'mock-data.ndjson';
        mimeType = 'application/x-ndjson';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    [result]
  );

  const copyToClipboard = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result.data, null, 2));
  }, [result]);

  return {
    schemaText,
    setSchemaText,
    config,
    setConfig,
    result,
    error,
    isGenerating,
    generate,
    presets,
    savePreset,
    loadPreset,
    deletePreset,
    outputFormat,
    setOutputFormat,
    downloadResult,
    copyToClipboard,
  };
}

