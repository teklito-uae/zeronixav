import { useState } from 'react'
import {
  Cpu,
  Key,
  Sliders,
  CheckCircle2,
  Save,
  Lock,
  Unlock,
  Loader2,
  Sparkles,
  Activity,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type AiProvider = 'openai' | 'claude' | 'gemini'

interface ProviderInfo {
  id: AiProvider
  name: string
  models: string[]
  defaultModel: string
}

const PROVIDERS: ProviderInfo[] = [
  {
    id: 'openai',
    name: 'OpenAI (GPT-4o / GPT-4 Turbo)',
    models: ['gpt-4o', 'gpt-4-turbo-2024-04-09', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o',
  },
  {
    id: 'claude',
    name: 'Anthropic (Claude Sonnet / Opus)',
    models: ['claude-sonnet-5', 'claude-opus-4-8', 'claude-haiku-4-5-20251001'],
    defaultModel: 'claude-sonnet-5',
  },
  {
    id: 'gemini',
    name: 'Google AI (Gemini 1.5 Pro / Flash)',
    models: ['gemini-1.5-pro-latest', 'gemini-1.5-flash-latest', 'gemini-1.0-pro'],
    defaultModel: 'gemini-1.5-pro-latest',
  }
]

export default function AdminAiSettingsPage() {
  const [selectedProvider, setSelectedProvider] = useState<AiProvider>('gemini')
  const [modelName, setModelName] = useState('gemini-1.5-pro-latest')
  const [apiKey, setApiKey] = useState('AIzaSyD-•••••••••••••••••••••••••••••••••••')
  const [isKeyRevealed, setIsKeyRevealed] = useState(false)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [temperature, setTemperature] = useState(0.70)
  const [isActive, setIsActive] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleProviderSelect = (provider: AiProvider) => {
    setSelectedProvider(provider)
    const found = PROVIDERS.find(p => p.id === provider)
    if (found) setModelName(found.defaultModel)
  }

  const handleDeploy = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3500)
    }, 600)
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Cpu className="w-5 h-5 text-accent" />
            <span>AI Configuration</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5 max-w-xl">
            Configure the model powering the Solution Builder and MCP product endpoints.
          </p>
        </div>

        <Button onClick={handleDeploy} disabled={isSaving} size="sm">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Deploying…' : saveSuccess ? 'Deployed' : 'Save & Deploy'}</span>
        </Button>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-sm bg-success/10 border border-success/30 text-success flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>AI configuration updated — now routing through <span className="font-mono">{modelName}</span>.</span>
        </div>
      )}

      {/* Provider selection */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>Provider</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PROVIDERS.map((prov) => {
            const isSelected = selectedProvider === prov.id

            return (
              <Card
                key={prov.id}
                onClick={() => handleProviderSelect(prov.id)}
                className={`cursor-pointer transition-colors select-none ${isSelected ? 'border-accent bg-accent/5' : 'hover:border-border-strong'}`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-sm border ${isSelected ? 'border-accent text-accent bg-accent/15' : 'border-border text-text-muted bg-bg-raised'}`}>
                      {isSelected ? 'Active' : 'Standby'}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-accent" />}
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">{prov.name}</h3>
                  <p className="text-[11px] font-mono text-text-secondary truncate">{prov.models.join(', ')}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Model + key */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1.5 border-b border-border pb-3">
            <Key className="w-4 h-4 text-accent" />
            <span>Model & API Key</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Model</Label>
              <Select value={modelName} onValueChange={setModelName}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROVIDERS.find(p => p.id === selectedProvider)?.models.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>API key</Label>
                <button
                  onClick={() => setIsKeyRevealed(!isKeyRevealed)}
                  type="button"
                  className="text-accent hover:underline flex items-center gap-1 text-[11px]"
                >
                  {isKeyRevealed ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  <span>{isKeyRevealed ? 'Hide' : 'Reveal'}</span>
                </button>
              </div>
              <Input
                type={isKeyRevealed ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste new secret key…"
                className="font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameters */}
      <Card>
        <CardContent className="p-5 space-y-6">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1.5 border-b border-border pb-3">
            <Sliders className="w-4 h-4 text-accent" />
            <span>Parameters</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Max output tokens</Label>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-sm bg-bg-raised border border-border text-accent">
                  {maxTokens}
                </span>
              </div>
              <input
                type="range"
                min="512"
                max="4096"
                step="256"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer h-1.5 bg-bg-raised rounded-full appearance-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Temperature</Label>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-sm bg-bg-raised border border-border text-accent">
                  {temperature.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.00"
                max="1.50"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-accent cursor-pointer h-1.5 bg-bg-raised rounded-full appearance-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-text-primary flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                <span>Enable AI engine</span>
              </div>
              <p className="text-xs text-text-secondary">
                When disabled, the Solution Builder falls back to static hardware recommendations.
              </p>
            </div>

            <button
              onClick={() => setIsActive(!isActive)}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 shrink-0 ${
                isActive ? 'bg-accent justify-end' : 'bg-bg-raised border border-border justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-sm block" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
