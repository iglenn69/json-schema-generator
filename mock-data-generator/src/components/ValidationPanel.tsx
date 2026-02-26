import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { GenerationResult } from '../types/schema';

interface Props {
  result: GenerationResult;
}

export function ValidationPanel({ result }: Props) {
  const invalidCount = result.validationResults.filter((r) => !r.valid).length;
  const validCount = result.count - invalidCount;

  return (
    <div className="flex flex-col gap-3">
      {/* Summary */}
      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2">
          <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--color-success)' }}>{validCount}</span>
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>valid</span>
        </div>
        <div className="w-px h-6" style={{ background: 'var(--color-border)' }} />
        <div className="flex items-center gap-2">
          <XCircle size={16} style={{ color: invalidCount > 0 ? 'var(--color-error)' : 'var(--color-muted)' }} />
          <span className="text-sm font-semibold" style={{ color: invalidCount > 0 ? 'var(--color-error)' : 'var(--color-muted)' }}>{invalidCount}</span>
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>invalid</span>
        </div>
        {result.allValid && (
          <div className="ml-auto flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-success)' }}>
            <CheckCircle size={13} />
            All objects passed validation
          </div>
        )}
      </div>

      {/* Error list */}
      {invalidCount > 0 ? (
        <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: '340px' }}>
          {result.validationResults.map((r, i) =>
            r.valid ? null : (
              <div
                key={i}
                className="rounded-lg p-3 flex flex-col gap-2"
                style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.25)' }}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle size={13} style={{ color: 'var(--color-error)' }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-error)' }}>
                    Object #{i + 1}
                  </span>
                </div>
                {r.errors.map((err, j) => (
                  <div key={j} className="text-xs pl-5 flex flex-col gap-0.5">
                    <span className="font-mono" style={{ color: 'var(--color-warning)' }}>
                      {err.instancePath || '/'}
                    </span>
                    <span style={{ color: 'var(--color-muted)' }}>
                      [{err.keyword}] {err.message}
                    </span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-8" style={{ color: 'var(--color-muted)' }}>
          <CheckCircle size={40} style={{ color: 'var(--color-success)', opacity: 0.4 }} />
          <p className="text-sm">No validation errors found</p>
        </div>
      )}
    </div>
  );
}
