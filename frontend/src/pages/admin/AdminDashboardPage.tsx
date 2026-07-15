import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  FileText,
  Cpu,
  Building2,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Settings,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface QuotationFeedItem {
  id: string
  sku: string
  title: string
  clientCompany: string
  region: string
  hub: string
  timestamp: string
  status: 'Pending Review' | 'BOM Generated' | 'Quote Sent'
}

const RECENT_QUOTATIONS: QuotationFeedItem[] = [
  {
    id: 'QT-2026-8914',
    sku: 'YEA-MVC840',
    title: 'Yealink MVC840 Microsoft Teams Rooms System',
    clientCompany: 'Aramco Energy Ventures',
    region: 'KSA',
    hub: 'Riyadh KAFD Tower 4',
    timestamp: '14 minutes ago',
    status: 'BOM Generated',
  },
  {
    id: 'QT-2026-8913',
    sku: 'HIK-DS-D5B65RB',
    title: 'Hikvision 65-inch Interactive Flat Panel LED Wall',
    clientCompany: 'Qatar National Bank (QNB)',
    region: 'Qatar',
    hub: 'Doha Lusail Marina Hub',
    timestamp: '1 hour ago',
    status: 'Quote Sent',
  },
  {
    id: 'QT-2026-8912',
    sku: 'CRE-NVX-350',
    title: 'Crestron DM-NVX-350 4K60 AV-over-IP Encoder/Decoder',
    clientCompany: 'Emirates Group Engineering',
    region: 'UAE',
    hub: 'Dubai Al Quoz 1 HQ Hub',
    timestamp: '3 hours ago',
    status: 'Pending Review',
  },
  {
    id: 'QT-2026-8911',
    sku: 'SHU-MXA920-W',
    title: 'Shure MXA920 Ceiling Array Microphone',
    clientCompany: 'Petroleum Development Oman (PDO)',
    region: 'Oman',
    hub: 'Muscat Al Khuwair Hub',
    timestamp: '5 hours ago',
    status: 'Quote Sent',
  },
]

const STATUS_VARIANT: Record<QuotationFeedItem['status'], 'default' | 'success' | 'warning'> = {
  'BOM Generated': 'default',
  'Quote Sent': 'success',
  'Pending Review': 'warning',
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'uae' | 'ksa' | 'qatar'>('all')

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-text-primary">Overview</h1>
          <p className="text-xs text-text-secondary">
            Catalog, quotation, and integration activity across GCC hubs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button asChild size="sm">
            <Link to="/admin/products">
              <PlusCircle className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link to="/admin/ai-settings">
              <Settings className="w-4 h-4" />
              <span>AI Settings</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">
                Hardware Catalog
              </span>
              <div className="text-2xl font-bold text-text-primary">
                68 <span className="text-sm font-normal text-text-muted">SKUs</span>
              </div>
              <Link to="/admin/products" className="text-[11px] text-accent hover:underline inline-flex items-center gap-1">
                View table <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center text-accent shrink-0">
              <Box className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">
                Solution Blueprints
              </span>
              <div className="text-2xl font-bold text-text-primary">
                5 <span className="text-sm font-normal text-text-muted">Core</span>
              </div>
              <Link to="/admin/services" className="text-[11px] text-accent hover:underline inline-flex items-center gap-1">
                Edit blueprints <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">
                AI Brain Engine
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-text-primary">Gemini 1.5 Pro</span>
                <Badge variant="success">Active</Badge>
              </div>
              <Link to="/admin/ai-settings" className="text-[11px] text-accent hover:underline inline-flex items-center gap-1">
                Switch provider <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="w-10 h-10 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feed + Quick links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between border-b border-border pb-4">
            <div>
              <CardTitle>Recent Quotations</CardTitle>
              <p className="text-xs text-text-secondary mt-0.5">
                Requests from client inquiries and the Solution Builder.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-bg-raised p-1 rounded-sm border border-border text-xs shrink-0">
              {(['all', 'uae', 'ksa'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 rounded-sm font-medium transition-colors ${
                    activeTab === tab ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {tab === 'all' ? 'All' : tab.toUpperCase()}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="divide-y divide-border/60 pt-0">
            {RECENT_QUOTATIONS.filter((item) => activeTab === 'all' || item.region.toLowerCase() === activeTab).map((quote) => (
              <div key={quote.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded-sm bg-bg-raised border border-border text-text-primary">
                      {quote.sku}
                    </span>
                    <span className="text-[11px] text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {quote.timestamp}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-text-primary truncate">{quote.title}</div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <span className="font-medium text-text-primary">{quote.clientCompany}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-text-muted">
                      <Building2 className="w-3.5 h-3.5" />
                      {quote.hub}
                    </span>
                  </div>
                </div>

                <Badge variant={STATUS_VARIANT[quote.status]}>{quote.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catalog Shortcuts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {[
              { label: 'Products', sub: '68 items', to: '/admin/products' },
              { label: 'Categories', sub: '4 hierarchies', to: '/admin/categories' },
              { label: 'Brands', sub: '10 partners', to: '/admin/brands' },
              { label: 'Banners', sub: 'Homepage promos', to: '/admin/banners' },
            ].map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className="flex items-center justify-between p-3 rounded-sm bg-bg-raised border border-border hover:border-accent/40 transition-colors group"
              >
                <div>
                  <div className="text-xs font-semibold text-text-primary">{s.label}</div>
                  <div className="text-[11px] text-text-muted">{s.sub}</div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
