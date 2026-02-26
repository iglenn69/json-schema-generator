import { Settings, Zap } from 'lucide-react';
import type { GeneratorConfig } from '../types/schema';

interface Props {
  config: GeneratorConfig;
  onChange: (c: GeneratorConfig) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  disabled: boolean;
}

function SliderField({
  label,
  help,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  help?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
          {label}
        </label>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded"
          style={{ background: 'var(--color-surface-3)', color: 'var(--color-text)' }}
        >
          {format ? format(value) : value}
        </span>
      </div>
      {help && <p className="text-[11px]" style={{ color: 'var(--color-muted)', opacity: 0.7 }}>{help}</p>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: 'var(--color-accent)' }}
      />
    </div>
  );
}

function Toggle({
  label,
  help,
  checked,
  onChange,
}: {
  label: string;
  help?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
          {label}
        </span>
        {help && (
          <span className="text-[11px]" style={{ color: 'var(--color-muted)', opacity: 0.6 }}>
            {help}
          </span>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative shrink-0 w-9 h-5 rounded-full transition-colors duration-200"
        style={{
          background: checked ? 'var(--color-accent)' : 'var(--color-surface-3)',
          border: '1px solid var(--color-border)',
        }}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
          style={{ transform: checked ? 'translateX(16px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );
}

export function GeneratorConfig({ config, onChange, onGenerate, isGenerating, disabled }: Props) {
  const update = (patch: Partial<GeneratorConfig>) => onChange({ ...config, ...patch });

  return (
    <section
      style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
      className="rounded-xl border flex flex-col gap-4 p-4"
    >
      <div className="flex items-center gap-2">
        <Settings size={16} style={{ color: 'var(--color-accent)' }} />
        <span className="text-sm font-semibold">Generator Settings</span>
      </div>

      {/* Count */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
            Objects to Generate
          </label>
          <input
            type="number"
            value={config.count}
            min={1}
            max={10000}
            onChange={(e) => update({ count: Math.max(1, Math.min(10000, parseInt(e.target.value) || 1)) })}
            className="w-20 text-right text-xs font-mono px-2 py-1 rounded outline-none"
            style={{
              background: 'var(--color-surface-3)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>
        <input
          type="range"
          min={1}
          max={500}
          step={1}
          value={Math.min(config.count, 500)}
          onChange={(e) => update({ count: parseInt(e.target.value) })}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: 'var(--color-accent)' }}
        />
        <div className="flex justify-between text-[11px]" style={{ color: 'var(--color-muted)', opacity: 0.5 }}>
          <span>1</span><span>250</span><span>500+</span>
        </div>
      </div>

      <div className="w-full h-px" style={{ background: 'var(--color-border)' }} />

      {/* Optional probability */}
      <SliderField
        label="Optional Fields Probability"
        help="Chance that optional properties are included"
        value={config.optionalsProbability}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => update({ optionalsProbability: v })}
        format={(v) => `${Math.round(v * 100)}%`}
      />

      <div className="w-full h-px" style={{ background: 'var(--color-border)' }} />

      {/* Toggles */}
      <Toggle
        label="Use Seed"
        help="Reproducible output with the same seed"
        checked={config.useSeed}
        onChange={(v) => update({ useSeed: v })}
      />

      {config.useSeed && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
            Seed Value
          </label>
          <input
            type="number"
            value={config.seed ?? 42}
            onChange={(e) => update({ seed: parseInt(e.target.value) || 0 })}
            className="w-full text-xs font-mono px-3 py-1.5 rounded outline-none"
            style={{
              background: 'var(--color-surface-3)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
        </div>
      )}

      <Toggle
        label="Fail on Invalid Types"
        help="Throw an error if schema has unsupported types"
        checked={config.failOnInvalidTypes}
        onChange={(v) => update({ failOnInvalidTypes: v })}
      />

      <div className="w-full h-px" style={{ background: 'var(--color-border)' }} />

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={disabled || isGenerating}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
        style={{
          background: disabled || isGenerating ? 'var(--color-surface-3)' : 'var(--color-accent)',
          color: disabled || isGenerating ? 'var(--color-muted)' : '#fff',
          cursor: disabled || isGenerating ? 'not-allowed' : 'pointer',
          border: 'none',
        }}
      >
        {isGenerating ? (
          <>
            <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
            Generating…
          </>
        ) : (
          <>
            <Zap size={15} />
            Generate Mock Data
          </>
        )}
      </button>
    </section>
  );
}
