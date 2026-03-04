import { useState } from 'react';
import { Copy, Download, CheckCircle, ChevronDown, ChevronRight, Save } from 'lucide-react';
import type { GenerationResult, OutputFormat } from '../types/schema';

interface Props {
  result: GenerationResult;
  onDownload: (fmt: OutputFormat) => void;
  onCopy: () => void;
  onSaveToLocalStorage: (key: string) => { success: boolean; error?: string };
}

export function OutputViewer({ result, onDownload, onCopy, onSaveToLocalStorage }: Props) {
  const [copied, setCopied] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [fmt, setFmt] = useState<OutputFormat>('json-array');
  const [lsKey, setLsKey] = useState('');
  const [lsSaved, setLsSaved] = useState(false);
  const [lsError, setLsError] = useState<string | null>(null);

  const handleSaveToLocalStorage = () => {
    setLsError(null);
    const { success, error } = onSaveToLocalStorage(lsKey);
    if (success) {
      setLsSaved(true);
      setTimeout(() => setLsSaved(false), 2000);
    } else {
      setLsError(error ?? 'Unknown error');
    }
  };

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const preview = JSON.stringify(result.data, null, 2);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Pill label="Objects" value={String(result.count)} color="var(--color-accent)" />
        {result.allValid ? (
          <Pill label="Validation" value="All Valid" color="var(--color-success)" />
        ) : (
          <Pill
            label="Validation"
            value={`${result.validationResults.filter((r) => !r.valid).length} Errors`}
            color="var(--color-error)"
          />
        )}
        {result.schemaTitle && (
          <Pill label="Schema" value={result.schemaTitle} color="var(--color-muted)" />
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Format selector */}
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
          {(['json-array', 'json', 'ndjson'] as OutputFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFmt(f)}
              className="px-3 py-1 text-xs transition-colors"
              style={{
                background: fmt === f ? 'var(--color-accent)' : 'var(--color-surface-3)',
                color: fmt === f ? '#fff' : 'var(--color-muted)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {f === 'json-array' ? 'JSON Array' : f === 'json' ? 'Pretty JSON' : 'NDJSON'}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
          style={{
            background: 'var(--color-surface-3)',
            border: '1px solid var(--color-border)',
            color: copied ? 'var(--color-success)' : 'var(--color-muted)',
            cursor: 'pointer',
          }}
        >
          {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={() => onDownload(fmt)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
          style={{
            background: 'var(--color-accent)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <Download size={12} />
          Download
        </button>
      </div>

      {/* Save to localStorage */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] shrink-0" style={{ color: 'var(--color-muted)' }}>Save to localStorage:</span>
        <input
          type="text"
          value={lsKey}
          onChange={(e) => { setLsKey(e.target.value); setLsError(null); }}
          placeholder="Enter storage key…"
          className="flex-1 px-2.5 py-1 rounded-lg text-xs"
          style={{
            background: 'var(--color-surface-3)',
            border: `1px solid ${lsError ? 'var(--color-error)' : 'var(--color-border)'}`,
            color: 'var(--color-text)',
            outline: 'none',
            minWidth: 0,
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveToLocalStorage()}
        />
        <button
          onClick={handleSaveToLocalStorage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all shrink-0"
          style={{
            background: lsSaved ? 'var(--color-success)' : 'var(--color-surface-3)',
            border: '1px solid var(--color-border)',
            color: lsSaved ? '#fff' : 'var(--color-muted)',
            cursor: 'pointer',
          }}
        >
          {lsSaved ? <CheckCircle size={12} /> : <Save size={12} />}
          {lsSaved ? 'Saved!' : 'Save'}
        </button>
      </div>
      {lsError && (
        <p className="text-[11px]" style={{ color: 'var(--color-error)', margin: 0 }}>{lsError}</p>
      )}

      {/* Records explorer */}
      <div
        className="rounded-lg flex flex-col gap-0 overflow-y-auto flex-1"
        style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface-3)', maxHeight: '260px' }}
      >
        {result.data.slice(0, 100).map((item, i) => (
          <div
            key={i}
            style={{ borderBottom: i < result.data.length - 1 ? '1px solid var(--color-border)' : 'none' }}
          >
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-white/5"
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer' }}
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            >
              {expandedIndex === i ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <span className="text-xs font-mono" style={{ color: 'var(--color-muted)' }}>
                #{i + 1}
              </span>
              <span className="text-xs truncate flex-1" style={{ color: 'var(--color-muted)' }}>
                {JSON.stringify(item).slice(0, 80)}
                {JSON.stringify(item).length > 80 ? '…' : ''}
              </span>
              {result.validationResults[i]?.valid ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(34,211,165,0.15)', color: 'var(--color-success)' }}>✓</span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.15)', color: 'var(--color-error)' }}>✗</span>
              )}
            </button>
            {expandedIndex === i && (
              <pre
                className="px-4 pb-3 text-[12px] overflow-x-auto"
                style={{ color: 'var(--color-text)', margin: 0 }}
              >
                {JSON.stringify(item, null, 2)}
              </pre>
            )}
          </div>
        ))}
        {result.data.length > 100 && (
          <div className="px-3 py-2 text-xs" style={{ color: 'var(--color-muted)' }}>
            + {result.data.length - 100} more objects (download to see all)
          </div>
        )}
      </div>

      {/* Full JSON preview */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>Full Output Preview</span>
        <pre
          className="p-3 rounded-lg text-[11px] overflow-auto"
          style={{
            background: 'var(--color-surface-3)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            maxHeight: '160px',
            margin: 0,
          }}
        >
          {preview.slice(0, 4000)}{preview.length > 4000 ? '\n…truncated' : ''}
        </pre>
      </div>
    </div>
  );
}

function Pill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
      style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}
    >
      <span style={{ opacity: 0.7 }}>{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
