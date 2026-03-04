import { useState } from 'react'
import { Database, Github } from 'lucide-react'
import { useSchemaGenerator } from './hooks/useSchemaGenerator'
import { SchemaEditor } from './components/SchemaEditor'
import { GeneratorConfig } from './components/GeneratorConfig'
import { OutputViewer } from './components/OutputViewer'
import { ValidationPanel } from './components/ValidationPanel'
import { PresetsPanel } from './components/PresetsPanel'
import type { ActiveTab } from './types/schema'

const TABS: { id: ActiveTab; label: string }[] = [
  { id: 'output', label: 'Output' },
  { id: 'validation', label: 'Validation' },
  { id: 'presets', label: 'Presets' },
]

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('output')
  const {
    schemaText, setSchemaText,
    config, setConfig,
    result, error,
    isGenerating, generate,
    presets, savePreset, loadPreset, deletePreset,
    downloadResult, copyToClipboard, saveToLocalStorage,
  } = useSchemaGenerator()

  const handleLoadPreset = (preset: Parameters<typeof loadPreset>[0]) => {
    loadPreset(preset)
    setActiveTab('output')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-surface)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center gap-3 px-6 py-3"
        style={{
          background: 'rgba(15,17,23,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--color-accent)' }}
          >
            <Database size={16} color="#fff" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none">MockForge</h1>
            <p className="text-[11px] leading-none mt-0.5" style={{ color: 'var(--color-muted)' }}>
              JSON Schema Mock Data Generator
            </p>
          </div>
        </div>
        <div className="flex-1" />
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="p-2 rounded-lg transition-colors hover:bg-white/5"
          style={{ color: 'var(--color-muted)' }}
        >
          <Github size={16} />
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 p-4 md:p-6 grid gap-4" style={{ gridTemplateColumns: '1fr', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'minmax(0,1fr) 280px' }}>
          {/* Left: schema + results */}
          <div className="flex flex-col gap-4">
            {/* Schema editor */}
            <SchemaEditor
              value={schemaText}
              onChange={setSchemaText}
              error={error}
            />

            {/* Results tabs */}
            {result && (
              <section
                style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                className="rounded-xl border flex flex-col gap-3 p-4"
              >
                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--color-surface-3)' }}>
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex-1 py-1.5 rounded-md text-xs font-medium transition-all"
                      style={{
                        background: activeTab === tab.id ? 'var(--color-accent)' : 'transparent',
                        color: activeTab === tab.id ? '#fff' : 'var(--color-muted)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {tab.label}
                      {tab.id === 'validation' && !result.allValid && (
                        <span
                          className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                          style={{ background: 'var(--color-error)', color: '#fff' }}
                        >
                          !
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {activeTab === 'output' && (
                  <OutputViewer
                    result={result}
                    onDownload={downloadResult}
                    onCopy={copyToClipboard}
                    onSaveToLocalStorage={saveToLocalStorage}
                  />
                )}
                {activeTab === 'validation' && <ValidationPanel result={result} />}
                {activeTab === 'presets' && (
                  <PresetsPanel
                    presets={presets}
                    onLoad={handleLoadPreset}
                    onDelete={deletePreset}
                    onSave={savePreset}
                    canSave={!!schemaText}
                  />
                )}
              </section>
            )}

            {/* Presets when no result yet */}
            {!result && (
              <section
                style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                className="rounded-xl border flex flex-col gap-3 p-4"
              >
                <p className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>Saved Presets</p>
                <PresetsPanel
                  presets={presets}
                  onLoad={handleLoadPreset}
                  onDelete={deletePreset}
                  onSave={savePreset}
                  canSave={!!schemaText}
                />
              </section>
            )}
          </div>

          {/* Right: config */}
          <div className="flex flex-col gap-4">
            <GeneratorConfig
              config={config}
              onChange={setConfig}
              onGenerate={generate}
              isGenerating={isGenerating}
              disabled={!schemaText.trim()}
            />

            {/* Quick tips */}
            <div
              className="rounded-xl p-4 flex flex-col gap-2"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
            >
              <p className="text-xs font-semibold" style={{ color: 'var(--color-muted)' }}>Tips</p>
              <ul className="text-[11px] flex flex-col gap-1.5" style={{ color: 'var(--color-muted)', listStyle: 'none', padding: 0, margin: 0 }}>
                <li>• Use <code style={{ color: 'var(--color-accent)' }}>"faker": "person.fullName"</code> for realistic data</li>
                <li>• Add <code style={{ color: 'var(--color-accent)' }}>"format": "email"</code> for email addresses</li>
                <li>• Set <code style={{ color: 'var(--color-accent)' }}>minItems / maxItems</code> to control array sizes</li>
                <li>• Use a seed for reproducible test data</li>
                <li>• Save schemas as presets for reuse</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

