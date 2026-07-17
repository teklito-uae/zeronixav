import { useState, useEffect, useRef } from 'react'
import {
  DownloadCloud,
  Loader2,
  PlayCircle,
  ImageOff,
  PlusCircle,
  ArrowLeft,
  Eye,
  CheckCircle2,
  XCircle,
  StopCircle,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Category, ScrapeBatch, ScrapeItem } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from '@/components/ui/sheet'

const TERMINAL_STATUSES: ScrapeBatch['status'][] = ['completed', 'completed_with_errors', 'failed', 'cancelled']
const ACTIVE_STATUSES: ScrapeBatch['status'][] = ['queued', 'running']
const POLL_INTERVAL_MS = 2000

function batchStatusVariant(status: ScrapeBatch['status']): 'default' | 'secondary' | 'success' | 'warning' | 'destructive' {
  switch (status) {
    case 'draft':
      return 'secondary'
    case 'queued':
    case 'running':
      return 'warning'
    case 'completed':
      return 'success'
    case 'completed_with_errors':
      return 'warning'
    case 'failed':
      return 'destructive'
    case 'cancelled':
      return 'secondary'
    default:
      return 'default'
  }
}

function itemStatusVariant(status: ScrapeItem['status']): 'default' | 'secondary' | 'success' | 'warning' | 'destructive' {
  switch (status) {
    case 'pending':
      return 'secondary'
    case 'processing':
      return 'warning'
    case 'done':
      return 'success'
    case 'failed':
      return 'destructive'
    case 'skipped':
      return 'secondary'
    default:
      return 'default'
  }
}

function formatBatchLabel(status: ScrapeBatch['status']): string {
  switch (status) {
    case 'completed_with_errors':
      return 'Completed with errors'
    case 'cancelled':
      return 'Cancelled'
    default:
      return status.charAt(0).toUpperCase() + status.slice(1)
  }
}

export default function AdminProductScraperPage() {
  const [view, setView] = useState<'list' | 'detail'>('list')

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [jsonText, setJsonText] = useState('')
  const [isPopulating, setIsPopulating] = useState(false)

  const [batch, setBatch] = useState<ScrapeBatch | null>(null)
  const [items, setItems] = useState<ScrapeItem[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const [batches, setBatches] = useState<ScrapeBatch[]>([])
  const [isLoadingBatches, setIsLoadingBatches] = useState(true)

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const toastedBatchIdRef = useRef<number | null>(null)

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
  }

  const loadCategories = async () => {
    setIsLoadingCategories(true)
    try {
      const res = await api.get<{ categories: Category[] }>('/api/v1/admin/categories')
      setCategories(res.categories)
    } catch {
      toast.error('Could not load categories.')
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const loadBatches = async () => {
    setIsLoadingBatches(true)
    try {
      const res = await api.get<{ batches: ScrapeBatch[] }>('/api/v1/admin/scrape-batches')
      setBatches(res.batches)
    } catch {
      // Non-critical — silently ignore.
    } finally {
      setIsLoadingBatches(false)
    }
  }

  useEffect(() => {
    loadCategories()
    loadBatches()
    return () => stopPolling()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const announceCompletion = (b: ScrapeBatch) => {
    if (toastedBatchIdRef.current === b.id) return
    toastedBatchIdRef.current = b.id
    const created = b.processed_items - b.failed_items
    if (b.status === 'failed') {
      toast.error(b.error_message || 'Scrape batch failed.')
    } else if (b.failed_items > 0) {
      toast.warning(`${created} product(s) created, ${b.failed_items} failed.`)
    } else {
      toast.success(`${created} product(s) created successfully.`)
    }
  }

  const fetchBatchStatus = async (batchId: number) => {
    try {
      const res = await api.get<{ batch: ScrapeBatch; items: ScrapeItem[] }>(
        `/api/v1/admin/scrape-batches/${batchId}`
      )
      setBatch(res.batch)
      setItems(res.items)
      return res.batch
    } catch {
      return null
    }
  }

  const startPolling = (batchId: number) => {
    stopPolling()
    pollIntervalRef.current = setInterval(async () => {
      const updated = await fetchBatchStatus(batchId)
      if (updated && TERMINAL_STATUSES.includes(updated.status)) {
        stopPolling()
        announceCompletion(updated)
        loadBatches()
      }
    }, POLL_INTERVAL_MS)
  }

  const handlePopulate = async () => {
    if (!selectedCategoryId || !jsonText.trim()) return
    setIsPopulating(true)
    try {
      const res = await api.post<{ batch: ScrapeBatch; items: ScrapeItem[] }>(
        '/api/v1/admin/scrape-batches',
        { category_id: Number(selectedCategoryId), json: jsonText }
      )
      stopPolling()
      toastedBatchIdRef.current = null
      setBatch(res.batch)
      setItems(res.items)
      toast.success(`Loaded ${res.items.length} item(s) for preview.`)
      setIsSheetOpen(false)
      setJsonText('')
      setSelectedCategoryId('')
      setView('detail')
      loadBatches()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to populate table.')
    } finally {
      setIsPopulating(false)
    }
  }

  const handleOpenScrapeSheet = () => {
    setJsonText('')
    setSelectedCategoryId('')
    setIsSheetOpen(true)
  }

  const handleRun = async () => {
    if (!batch) return
    setIsRunning(true)
    try {
      const res = await api.post<{ batch: ScrapeBatch }>(`/api/v1/admin/scrape-batches/${batch.id}/run`)
      setBatch(res.batch)
      toastedBatchIdRef.current = null
      if (ACTIVE_STATUSES.includes(res.batch.status)) {
        startPolling(batch.id)
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to start scrape run.')
    } finally {
      setIsRunning(false)
    }
  }

  const handleStopBatch = async (batchId: number) => {
    try {
      const res = await api.post<{ batch: ScrapeBatch }>(`/api/v1/admin/scrape-batches/${batchId}/stop`)
      if (batch && batch.id === batchId) {
        setBatch(res.batch)
        stopPolling()
      }
      loadBatches()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to stop scrape batch.')
    }
  }

  const handleDeleteBatch = async (b: ScrapeBatch) => {
    if (!window.confirm('Delete this scrape batch and all its preview items? This cannot be undone.')) return
    try {
      await api.delete(`/api/v1/admin/scrape-batches/${b.id}`)
      setBatches((prev) => prev.filter((x) => x.id !== b.id))
      toast.success('Scrape batch deleted.')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete scrape batch.')
    }
  }

  const handleSelectBatch = async (b: ScrapeBatch) => {
    stopPolling()
    try {
      const res = await api.get<{ batch: ScrapeBatch; items: ScrapeItem[] }>(
        `/api/v1/admin/scrape-batches/${b.id}`
      )
      setBatch(res.batch)
      setItems(res.items)
      toastedBatchIdRef.current = TERMINAL_STATUSES.includes(res.batch.status) ? res.batch.id : null
      setView('detail')
      if (ACTIVE_STATUSES.includes(res.batch.status)) {
        startPolling(res.batch.id)
      }
    } catch {
      toast.error('Failed to load that batch.')
    }
  }

  const handleBackToList = () => {
    stopPolling()
    setView('list')
    setBatch(null)
    setItems([])
    loadBatches()
  }

  const handleItemFieldChange = (itemId: number, field: keyof ScrapeItem, value: unknown) => {
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, [field]: value } : it)))
  }

  const handleItemFieldBlur = async (itemId: number, field: string, value: unknown) => {
    if (!batch || batch.status !== 'draft') return
    try {
      const res = await api.patch<{ item: ScrapeItem }>(
        `/api/v1/admin/scrape-batches/${batch.id}/items/${itemId}`,
        { [field]: value }
      )
      setItems((prev) => prev.map((it) => (it.id === itemId ? res.item : it)))
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save changes.')
    }
  }

  const isDraft = batch?.status === 'draft'
  const isActiveRun = !!batch && ACTIVE_STATUSES.includes(batch.status)
  const isTerminal = !!batch && TERMINAL_STATUSES.includes(batch.status)
  const canRun = !!batch && (isDraft || batch.status === 'completed_with_errors' || batch.status === 'failed' || batch.status === 'cancelled')
  const processedCount = batch ? batch.processed_items + batch.failed_items : 0
  const progressPct = batch && batch.total_items > 0 ? Math.min(100, (processedCount / batch.total_items) * 100) : 0
  const failedItems = items.filter((it) => it.status === 'failed')

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <DownloadCloud className="w-5 h-5 text-accent" />
            <span>Product Scraper</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Paste scraped JSON for a category, preview and edit the mapped rows, then run the import.
          </p>
        </div>

        {view === 'list' && (
          <Button onClick={handleOpenScrapeSheet} size="sm">
            <PlusCircle className="w-4 h-4" />
            <span>Scrape New Data</span>
          </Button>
        )}
      </div>

      {view === 'list' ? (
        <div className="rounded-md border border-border bg-bg-surface overflow-hidden">
          {isLoadingBatches ? (
            <div className="flex items-center justify-center py-16 text-text-muted text-xs gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading batches…</span>
            </div>
          ) : batches.length === 0 ? (
            <div className="py-16 text-center text-text-muted text-xs">No scrape batches yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch #</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Progress</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((b) => (
                  <TableRow
                    key={b.id}
                    className="cursor-pointer"
                    onClick={() => handleSelectBatch(b)}
                  >
                    <TableCell className="whitespace-nowrap font-medium text-text-primary">#{b.id}</TableCell>
                    <TableCell className="whitespace-nowrap text-text-secondary">
                      {b.category?.name ?? `Category ${b.category_id}`}
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      <Badge variant={batchStatusVariant(b.status)}>{formatBatchLabel(b.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap text-text-secondary">
                      {b.processed_items + b.failed_items}/{b.total_items}
                      {b.failed_items > 0 && <span className="text-danger"> ({b.failed_items} failed)</span>}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-text-secondary">
                      {new Date(b.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectBatch(b)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {ACTIVE_STATUSES.includes(b.status) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Stop"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStopBatch(b.id)
                            }}
                          >
                            <StopCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {!ACTIVE_STATUSES.includes(b.status) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteBatch(b)
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-danger" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleBackToList}>
              <ArrowLeft className="w-4 h-4" />
              <span>Back to all scrapes</span>
            </Button>
            {batch && ACTIVE_STATUSES.includes(batch.status) && (
              <Button variant="secondary" size="sm" onClick={() => handleStopBatch(batch.id)}>
                <StopCircle className="w-4 h-4" />
                <span>Stop</span>
              </Button>
            )}
          </div>

          {batch && (
            <div className="rounded-md border border-border bg-bg-surface p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-text-secondary">Batch #{batch.id}</span>
                <span className="text-text-muted">·</span>
                <span className="text-text-secondary">{batch.category?.name ?? `Category ${batch.category_id}`}</span>
                <Badge variant={batchStatusVariant(batch.status)}>{formatBatchLabel(batch.status)}</Badge>
              </div>
            </div>
          )}

          {batch && items.length > 0 && (
            <div className="space-y-3">
              {(isActiveRun || isTerminal) && (
                <div className="rounded-md border border-border bg-bg-surface p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <span>
                      {processedCount} / {batch.total_items} processed ({batch.failed_items} failed)
                    </span>
                    {isActiveRun && (
                      <span className="flex items-center gap-1 text-text-muted">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Working…</span>
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-bg-raised overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              )}

              {isTerminal && (
                <div className="rounded-md border border-border bg-bg-surface p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-text-primary font-medium">
                      {batch.processed_items - batch.failed_items} product(s) created/updated
                    </span>
                  </div>
                  {batch.failed_items > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <XCircle className="w-4 h-4 text-danger" />
                        <span className="text-text-primary font-medium">{batch.failed_items} failed</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        {failedItems.map((it) => (
                          <div key={it.id} className="text-[11px] text-text-secondary">
                            <span className="font-medium text-text-primary">{it.title}</span>
                            {it.error_message && (
                              <span className="text-danger"> — {it.error_message}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {batch.status === 'failed' && batch.error_message && (
                    <p className="text-xs text-danger">{batch.error_message}</p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-text-muted">{items.length} item(s) in this batch</p>
                {canRun && (
                  <Button onClick={handleRun} disabled={isRunning} size="sm">
                    {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                    <span>
                      {batch.status === 'cancelled'
                        ? 'Resume Scrape'
                        : batch.status === 'completed_with_errors' || batch.status === 'failed'
                        ? 'Retry failed items'
                        : 'Run Scrape'}
                    </span>
                  </Button>
                )}
              </div>

              <div className="rounded-md border border-border bg-bg-surface overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Model Number</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Stock</TableHead>
                      <TableHead className="text-center">Cover</TableHead>
                      <TableHead className="text-center">Images</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => {
                      const cover = item.source_image_urls?.[0]
                      const showStatusMessage = item.status === 'processing' && item.status_message
                      const showErrorMessage = item.status === 'failed' && item.error_message
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="max-w-[220px]">
                            <div className="font-medium text-text-primary truncate" title={item.title}>
                              {item.title}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Input
                              value={item.sku ?? ''}
                              disabled={!isDraft}
                              onChange={(e) => handleItemFieldChange(item.id, 'sku', e.target.value)}
                              onBlur={(e) => handleItemFieldBlur(item.id, 'sku', e.target.value)}
                              className="h-8 w-28"
                            />
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Input
                              value={item.model_number ?? ''}
                              disabled={!isDraft}
                              onChange={(e) => handleItemFieldChange(item.id, 'model_number', e.target.value)}
                              onBlur={(e) => handleItemFieldBlur(item.id, 'model_number', e.target.value)}
                              className="h-8 w-28"
                            />
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <Input
                              value={item.brand_name ?? ''}
                              disabled={!isDraft}
                              onChange={(e) => handleItemFieldChange(item.id, 'brand_name', e.target.value)}
                              onBlur={(e) => handleItemFieldBlur(item.id, 'brand_name', e.target.value)}
                              className="h-8 w-28"
                            />
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <Input
                              type="number"
                              step="0.01"
                              value={item.price ?? ''}
                              disabled={!isDraft}
                              onChange={(e) => handleItemFieldChange(item.id, 'price', e.target.value)}
                              onBlur={(e) => handleItemFieldBlur(item.id, 'price', e.target.value === '' ? null : Number(e.target.value))}
                              className="h-8 w-24 text-right"
                            />
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            <Input
                              type="number"
                              value={item.stock ?? ''}
                              disabled={!isDraft}
                              onChange={(e) => handleItemFieldChange(item.id, 'stock', e.target.value)}
                              onBlur={(e) => handleItemFieldBlur(item.id, 'stock', e.target.value === '' ? null : Number(e.target.value))}
                              className="h-8 w-16 text-center"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {cover ? (
                              <img src={cover} alt="" className="w-9 h-9 rounded-sm object-cover border border-border mx-auto" />
                            ) : (
                              <div className="w-9 h-9 rounded-sm border border-border bg-bg-raised flex items-center justify-center mx-auto">
                                <ImageOff className="w-4 h-4 text-text-muted" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap text-text-secondary">
                            {item.source_image_urls?.length ?? 0}
                          </TableCell>
                          <TableCell className="text-center whitespace-nowrap">
                            <Badge variant={itemStatusVariant(item.status)}>{item.status}</Badge>
                            {showStatusMessage && (
                              <div className="text-[10px] text-text-muted mt-0.5">{item.status_message}</div>
                            )}
                            {showErrorMessage && (
                              <div
                                className="text-[10px] text-danger mt-0.5 truncate max-w-[140px] mx-auto"
                                title={item.error_message ?? undefined}
                              >
                                {item.error_message}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Scrape New Data</SheetTitle>
            <SheetDescription>
              Paste scraped JSON for a category. You'll be able to preview and edit the mapped rows before running the import.
            </SheetDescription>
          </SheetHeader>

          <SheetBody className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingCategories ? 'Loading…' : 'Select category'} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Scraped JSON</Label>
              <Textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder="Paste the scraped JSON array here…"
                className="min-h-[220px] font-mono"
              />
            </div>
          </SheetBody>

          <SheetFooter>
            <Button type="button" variant="secondary" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
            <Button
              onClick={handlePopulate}
              disabled={!selectedCategoryId || !jsonText.trim() || isPopulating}
            >
              {isPopulating && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Populate Table</span>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
