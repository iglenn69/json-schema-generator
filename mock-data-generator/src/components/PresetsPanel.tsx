import { useState } from 'react';
import { Bookmark, Trash2, Plus, Clock } from 'lucide-react';
import type { SavedPreset } from '../types/schema';

interface Props {
  presets: SavedPreset[];
  onLoad: (p: SavedPreset) => void;
  onDelete: (id: string) => void;
  onSave: (name: string) => void;
  canSave: boolean;
}

export function PresetsPanel({ presets, onLoad, onDelete, onSave, canSave }: Props) {
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!newName.trim()) return;
    onSave(newName.trim());
    setNewName('');
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Save new preset */}
      <div className="flex flex-col gap-2 p-3 rounded-lg" style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)' }}>
        {saving ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Preset name…"
              className="flex-1 text-xs px-3 py-1.5 rounded-lg outline-none"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            />
            <button
              onClick={handleSave}
              disabled={!newName.trim()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Save
            </button>
            <button
              onClick={() => setSaving(false)}
              className="px-3 py-1.5 rounded-lg text-xs"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-muted)', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSaving(true)}
            disabled={!canSave}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs transition-all"
            style={{
              background: canSave ? 'var(--color-surface-2)' : 'transparent',
              border: '1px dashed var(--color-border)',
              color: canSave ? 'var(--color-muted)' : 'var(--color-border)',
              cursor: canSave ? 'pointer' : 'not-allowed',
            }}
          >
            <Plus size={13} />
            Save current schema as preset
          </button>
        )}
      </div>

      {/* Presets list */}
      {presets.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8" style={{ color: 'var(--color-muted)' }}>
          <Bookmark size={32} style={{ opacity: 0.3 }} />
          <p className="text-xs">No saved presets yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {presets.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-lg group transition-colors"
              style={{ background: 'var(--color-surface-3)', border: '1px solid var(--color-border)' }}
            >
              <Bookmark size={14} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-xs font-semibold truncate">{p.name}</span>
                <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--color-muted)' }}>
                  <Clock size={10} />
                  {new Date(p.createdAt).toLocaleDateString()} · {p.config.count} objects
                </span>
              </div>
              <button
                onClick={() => onLoad(p)}
                className="px-2.5 py-1 rounded text-[11px] transition-colors opacity-0 group-hover:opacity-100"
                style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                Load
              </button>
              <button
                onClick={() => onDelete(p.id)}
                className="p-1.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                style={{ background: 'transparent', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
