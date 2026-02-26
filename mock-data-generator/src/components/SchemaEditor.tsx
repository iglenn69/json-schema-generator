import React, { useRef, useCallback } from 'react';
import { Upload, FileJson, X } from 'lucide-react';

const EXAMPLE_SCHEMA = JSON.stringify(
  {
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'User',
    type: 'object',
    required: ['id', 'name', 'email', 'age'],
    properties: {
      id: { type: 'integer', minimum: 1 },
      name: {
        type: 'string',
        faker: 'person.fullName',
        minLength: 2,
        maxLength: 60,
      },
      email: { type: 'string', format: 'email', faker: 'internet.email' },
      age: { type: 'integer', minimum: 18, maximum: 80 },
      address: {
        type: 'object',
        properties: {
          street: { type: 'string', faker: 'location.streetAddress' },
          city: { type: 'string', faker: 'location.city' },
          country: { type: 'string', faker: 'location.country' },
        },
      },
      tags: {
        type: 'array',
        items: { type: 'string', faker: 'word.noun' },
        minItems: 1,
        maxItems: 4,
      },
    },
  },
  null,
  2
);

interface Props {
  value: string;
  onChange: (v: string) => void;
  error: string | null;
}

export function SchemaEditor({ value, onChange, error }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.json')) {
        alert('Please select a .json file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onChange(text);
      };
      reader.readAsText(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dropRef.current?.classList.remove('drop-active');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.add('drop-active');
  };

  const handleDragLeave = () => {
    dropRef.current?.classList.remove('drop-active');
  };

  return (
    <section
      style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
      className="rounded-xl border flex flex-col gap-3 p-4 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileJson size={16} style={{ color: 'var(--color-accent)' }} />
          <span className="text-sm font-semibold">JSON Schema</span>
        </div>
        <div className="flex items-center gap-2">
          {value && (
            <button
              onClick={() => onChange('')}
              title="Clear"
              className="rounded-md p-1 transition-colors hover:bg-white/5"
              style={{ color: 'var(--color-muted)' }}
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={() => onChange(EXAMPLE_SCHEMA)}
            className="text-xs px-3 py-1 rounded-md transition-colors"
            style={{
              background: 'var(--color-surface-3)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-muted)',
            }}
          >
            Load Example
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors"
            style={{
              background: 'var(--color-accent)',
              color: '#fff',
            }}
          >
            <Upload size={12} />
            Upload File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      </div>

      {/* Drop zone / editor */}
      <div
        ref={dropRef}
        className="flex-1 rounded-lg transition-all"
        style={{ border: '1px solid var(--color-border)', minHeight: 0 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {value ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            className="w-full h-full p-3 resize-none outline-none rounded-lg"
            style={{
              background: 'transparent',
              color: 'var(--color-text)',
              minHeight: '300px',
            }}
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-3 p-8 h-full cursor-pointer"
            style={{ color: 'var(--color-muted)', minHeight: '300px' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={32} style={{ opacity: 0.4 }} />
            <p className="text-sm text-center">
              Drop a <code>.json</code> schema file here, or click to upload
            </p>
            <p className="text-xs" style={{ opacity: 0.6 }}>
              Or use the "Load Example" button to get started
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          className="text-xs p-3 rounded-lg"
          style={{
            background: 'rgba(248, 113, 113, 0.1)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            color: 'var(--color-error)',
          }}
        >
          {error}
        </div>
      )}
    </section>
  );
}
