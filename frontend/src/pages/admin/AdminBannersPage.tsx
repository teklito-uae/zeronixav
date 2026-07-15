import { useState, useEffect } from 'react'
import { Image, PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Banner } from '@/types/api'
import { COUNTRIES } from '@/lib/countries'
import CountryFlag from '@/components/ui/CountryFlag'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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

const ALL_COUNTRIES = 'all'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add')
  const [editId, setEditId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [countryCode, setCountryCode] = useState(ALL_COUNTRIES)
  const [sortOrder, setSortOrder] = useState('0')
  const [isActive, setIsActive] = useState(true)

  const loadBanners = async () => {
    setIsLoading(true)
    try {
      const res = await api.get<{ banners: Banner[] }>('/api/v1/admin/banners')
      setBanners(res.banners)
    } catch {
      toast.error('Could not reach the API. Is the backend running?')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBanners()
  }, [])

  const handleOpenAdd = () => {
    setSheetMode('add')
    setEditId(null)
    setTitle('')
    setImageUrl('')
    setLinkUrl('')
    setCountryCode(ALL_COUNTRIES)
    setSortOrder('0')
    setIsActive(true)
    setIsSheetOpen(true)
  }

  const handleOpenEdit = (banner: Banner) => {
    setSheetMode('edit')
    setEditId(banner.id)
    setTitle(banner.title)
    setImageUrl(banner.image_url)
    setLinkUrl(banner.link_url ?? '')
    setCountryCode(banner.country_code ?? ALL_COUNTRIES)
    setSortOrder(String(banner.sort_order))
    setIsActive(banner.is_active)
    setIsSheetOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      title,
      image_url: imageUrl,
      link_url: linkUrl || null,
      country_code: countryCode === ALL_COUNTRIES ? null : countryCode,
      sort_order: Number(sortOrder) || 0,
      is_active: isActive,
    }

    try {
      if (sheetMode === 'add') {
        await api.post('/api/v1/admin/banners', payload)
        toast.success('Banner added.')
      } else if (editId) {
        await api.put(`/api/v1/admin/banners/${editId}`, payload)
        toast.success('Banner updated.')
      }
      setIsSheetOpen(false)
      loadBanners()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save banner.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (banner: Banner) => {
    if (!window.confirm(`Delete "${banner.title}"? This cannot be undone.`)) return
    try {
      await api.delete(`/api/v1/admin/banners/${banner.id}`)
      setBanners((prev) => prev.filter((b) => b.id !== banner.id))
      toast.success('Banner deleted.')
    } catch {
      toast.error('Failed to delete banner.')
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Image className="w-5 h-5 text-accent" />
            <span>Banners</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">{banners.length} homepage banners</p>
        </div>

        <Button onClick={handleOpenAdd} size="sm">
          <PlusCircle className="w-4 h-4" />
          <span>Add Banner</span>
        </Button>
      </div>

      <div className="rounded-md border border-border bg-bg-surface overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-text-muted text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading banners…</span>
          </div>
        ) : banners.length === 0 ? (
          <div className="py-16 text-center text-text-muted text-xs">No banners yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Country</TableHead>
                <TableHead className="text-center">Order</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="w-16 h-9 rounded-sm bg-bg-raised border border-border overflow-hidden shrink-0">
                      <img src={banner.image_url} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-text-primary max-w-xs truncate">{banner.title}</TableCell>
                  <TableCell className="text-text-secondary whitespace-nowrap">
                    {banner.country_code ? COUNTRIES.find((c) => c.code === banner.country_code)?.name ?? banner.country_code : 'All regions'}
                  </TableCell>
                  <TableCell className="text-center font-mono">{banner.sort_order}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    <Badge variant={banner.is_active ? 'success' : 'secondary'}>
                      {banner.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(banner)} title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(banner)} title="Delete">
                        <Trash2 className="w-4 h-4 text-danger" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{sheetMode === 'add' ? 'Add Banner' : 'Edit Banner'}</SheetTitle>
            <SheetDescription>Homepage promotional banners, optionally targeted by country.</SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSave} className="contents">
            <SheetBody className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="banner-title">Title</Label>
                <Input id="banner-title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer AV Upgrade Offer" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="banner-image">Image URL</Label>
                <Input id="banner-image" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="banner-link">Link URL</Label>
                <Input id="banner-link" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="/products/… (optional)" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Target country</Label>
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_COUNTRIES}>All regions</SelectItem>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          <span className="flex items-center gap-2">
                            <CountryFlag code={c.code} />
                            {c.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="banner-order">Sort order</Label>
                  <Input id="banner-order" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(v === true)} />
                <span className="text-xs font-medium text-text-primary">Active — show on homepage</span>
              </label>
            </SheetBody>

            <SheetFooter>
              <Button type="button" variant="secondary" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{sheetMode === 'add' ? 'Create' : 'Save changes'}</span>
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
