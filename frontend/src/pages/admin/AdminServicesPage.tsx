import { useState } from 'react'
import { FileText, Save, CheckCircle2, Eye, Edit3, Globe, Box, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface ServiceBlueprint {
  id: string
  title: string
  slug: string
  summary: string
  seoTitle: string
  seoDescription: string
  content: string
  attachedSkus: string[]
}

const INITIAL_BLUEPRINTS: ServiceBlueprint[] = [
  {
    id: 'conf-room',
    title: 'Conference Room Solutions & Boardroom AV Integration',
    slug: 'conference-room-solutions',
    summary: 'Turnkey Microsoft Teams Rooms (MTR), Zoom Rooms, and BYOD wireless presentation suites for GCC enterprise boardrooms.',
    seoTitle: 'Enterprise Conference Room AV Solutions | ZeroNix Dubai & Riyadh',
    seoDescription: 'Design & deployment of certified Microsoft Teams Rooms and Dante audio arrays across Dubai Al Quoz, Riyadh KAFD, and Doha Lusail hubs.',
    content: `## Executive Overview

Modern enterprise collaboration requires high-fidelity, zero-latency audio and 4K UHD optical tracking cameras. ZeroNix AV engineered standardized boardroom architectures certified for Microsoft Teams Rooms (MTR) and Zoom Rooms across all GCC facilities.

### Architectural Blueprint Highlights
* **Optical Camera Systems**: Dual-eye intelligent PTZ tracking with speaker framing (\`Yealink MVC840\` / \`UVC86\`).
* **Acoustic Dante Network**: Beamforming ceiling microphone arrays (\`Shure MXA920\`) providing 100% speech coverage without desk clutter.
* **Touch Console Interface**: Single-cable PoE touch panels enabling one-touch meeting join and room control.

### GCC Engineering Compliance
All installations strictly meet UAE Ministry of Interior and Saudi Vision 2030 corporate acoustics guidelines.`,
    attachedSkus: ['YEA-MVC840', 'SHU-MXA920-W', 'CRE-NVX-350']
  },
  {
    id: 'digital-signage',
    title: 'Commercial Digital Signage & Direct-View LED Walls',
    slug: 'digital-signage-led-walls',
    summary: 'High-brightness 24/7 commercial displays, video walls, and centralized content management systems across retail and corporate lobbies.',
    seoTitle: 'Commercial Digital Signage & LED Walls | ZeroNix AV Dubai HQ',
    seoDescription: 'Direct-view fine-pitch LED walls and Samsung QM series commercial displays with 24/7 centralized cloud CMS across UAE and KSA.',
    content: `## High-Impact Visual Communication

Transform corporate lobbies, command centers, and retail flagships with ultra-high brightness Direct-View LED displays and commercial 4K panels.

### Technical Capabilities
* **Fine-Pitch dvLED**: 0.9mm to 1.5mm pixel pitch configurations with front-serviceable magnetic modules.
* **SoC Embedded CMS**: Samsung MagicINFO and LG SuperSign System-on-Chip remote scheduling.
* **Active Thermal Management**: Fanless, silent operation rated for continuous 100,000-hour lifespans.`,
    attachedSkus: ['HIK-DS-D5B65RB', 'SAM-QM85R', 'LGE-86TR3DJ']
  }
]

const ALL_SKU_OPTIONS = [
  { sku: 'YEA-MVC840', title: 'Yealink MVC840 MTR System', brand: 'Yealink' },
  { sku: 'SHU-MXA920-W', title: 'Shure MXA920 Ceiling Array Mic', brand: 'Shure' },
  { sku: 'CRE-NVX-350', title: 'Crestron DM-NVX-350 AV-over-IP', brand: 'Crestron' },
  { sku: 'HIK-DS-D5B65RB', title: 'Hikvision 65-inch Interactive Wall', brand: 'Hikvision' },
  { sku: 'SAM-QM85R', title: 'Samsung QM85R 85-inch 4K Signage', brand: 'Samsung' },
  { sku: 'LGE-86TR3DJ', title: 'LG 86TR3DJ 86-inch Interactive Display', brand: 'LG' },
]

export default function AdminServicesPage() {
  const [selectedService, setSelectedService] = useState<ServiceBlueprint>(INITIAL_BLUEPRINTS[0])
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const toggleSkuAttachment = (sku: string) => {
    const current = selectedService.attachedSkus
    const updated = current.includes(sku)
      ? current.filter(s => s !== sku)
      : [...current, sku]
    setSelectedService({ ...selectedService, attachedSkus: updated })
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            <span>Solution Blueprints</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Author service documentation, SEO metadata, and attach hardware SKUs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Select
            value={selectedService.id}
            onValueChange={(v) => {
              const found = INITIAL_BLUEPRINTS.find(b => b.id === v)
              if (found) setSelectedService(found)
            }}
          >
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              {INITIAL_BLUEPRINTS.map(b => (
                <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSave} size="sm">
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* SEO metadata */}
        <Card className="lg:col-span-3">
          <CardContent className="p-5 space-y-4">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1.5 border-b border-border pb-3">
              <Globe className="w-4 h-4 text-accent" />
              <span>SEO Metadata</span>
            </h3>

            <div className="space-y-1.5">
              <Label>URL slug</Label>
              <div className="flex items-center gap-1 bg-bg-raised border border-border rounded-sm px-2.5 py-1.5 font-mono text-[11px] text-text-muted">
                <span>/services/</span>
                <input
                  type="text"
                  value={selectedService.slug}
                  onChange={(e) => setSelectedService({ ...selectedService, slug: e.target.value })}
                  className="bg-transparent text-accent font-semibold focus:outline-none w-full"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <Label>Title tag</Label>
                <span className="text-[10px] font-mono text-text-muted">{selectedService.seoTitle.length}/65</span>
              </div>
              <Input
                value={selectedService.seoTitle}
                onChange={(e) => setSelectedService({ ...selectedService, seoTitle: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <Label>Meta description</Label>
                <span className="text-[10px] font-mono text-text-muted">{selectedService.seoDescription.length}/160</span>
              </div>
              <Textarea
                rows={3}
                value={selectedService.seoDescription}
                onChange={(e) => setSelectedService({ ...selectedService, seoDescription: e.target.value })}
              />
            </div>

            <div className="pt-3 border-t border-border space-y-2">
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-wide">
                Search result preview
              </div>
              <div className="p-3 rounded-sm bg-bg-raised border border-border space-y-1">
                <div className="text-[11px] text-blue-500 truncate">
                  zeronixav.com › services › {selectedService.slug}
                </div>
                <div className="text-xs font-semibold text-text-primary line-clamp-1">
                  {selectedService.seoTitle}
                </div>
                <div className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                  {selectedService.seoDescription}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Markdown editor */}
        <Card className="lg:col-span-6">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-accent" />
                <span>Content Editor</span>
              </h3>

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'editor' | 'preview')}>
                <TabsList>
                  <TabsTrigger value="editor"><Edit3 className="w-3.5 h-3.5" />Editor</TabsTrigger>
                  <TabsTrigger value="preview"><Eye className="w-3.5 h-3.5" />Preview</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {activeTab === 'editor' ? (
              <Textarea
                rows={16}
                value={selectedService.content}
                onChange={(e) => setSelectedService({ ...selectedService, content: e.target.value })}
                className="font-mono resize-none leading-relaxed"
              />
            ) : (
              <div className="p-4 bg-bg-raised border border-border rounded-sm min-h-[360px] max-h-[460px] overflow-y-auto text-xs">
                <div className="whitespace-pre-line text-text-secondary leading-relaxed">
                  {selectedService.content}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-text-muted pt-2 border-t border-border">
              <span>Markdown (GFM) supported</span>
              <span>{selectedService.content.length} characters</span>
            </div>
          </CardContent>
        </Card>

        {/* Attached SKUs */}
        <Card className="lg:col-span-3">
          <CardContent className="p-5 space-y-3">
            <div className="border-b border-border pb-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1.5">
                <Box className="w-4 h-4 text-accent" />
                <span>Attached Products</span>
              </h3>
              <p className="text-[11px] text-text-secondary mt-1">
                Shown in this service's product carousel.
              </p>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {ALL_SKU_OPTIONS.map((item) => {
                const isAttached = selectedService.attachedSkus.includes(item.sku)

                return (
                  <div
                    key={item.sku}
                    onClick={() => toggleSkuAttachment(item.sku)}
                    className={`p-2.5 rounded-sm border transition-colors cursor-pointer flex items-center justify-between gap-2 select-none ${
                      isAttached
                        ? 'bg-accent/10 border-accent text-text-primary'
                        : 'bg-bg-raised/60 border-border text-text-secondary hover:border-border-strong'
                    }`}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono text-xs font-bold ${isAttached ? 'text-accent' : 'text-text-primary'}`}>
                          {item.sku}
                        </span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-bg-surface border border-border text-text-muted">
                          {item.brand}
                        </span>
                      </div>
                      <div className="text-[11px] truncate text-text-secondary">
                        {item.title}
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 border ${
                        isAttached ? 'bg-accent border-accent text-white' : 'border-border bg-bg-surface'
                      }`}
                    >
                      {isAttached && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="pt-3 border-t border-border text-center">
              <span className="text-[11px] text-accent font-semibold">
                {selectedService.attachedSkus.length} products attached
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
