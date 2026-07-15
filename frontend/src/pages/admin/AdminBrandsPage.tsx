import { useState, useEffect } from 'react'
import { Tag, PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Brand } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from '@/components/ui/sheet'

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add')
  const [editId, setEditId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)

  const loadBrands = async () => {
    setIsLoading(true)
    try {
      const res = await api.get<{ brands: Brand[] }>('/api/v1/admin/brands')
      setBrands(res.brands)
    } catch {
      toast.error('Could not reach the API. Is the backend running?')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBrands()
  }, [])

  const handleOpenAdd = () => {
    setSheetMode('add')
    setEditId(null)
    setName('')
    setCountry('')
    setDescription('')
    setIsActive(true)
    setIsSheetOpen(true)
  }

  const handleOpenEdit = (brand: Brand) => {
    setSheetMode('edit')
    setEditId(brand.id)
    setName(brand.name)
    setCountry(brand.country ?? '')
    setDescription(brand.description ?? '')
    setIsActive(brand.is_active)
    setIsSheetOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = { name, country, description, is_active: isActive }

    try {
      if (sheetMode === 'add') {
        await api.post('/api/v1/admin/brands', payload)
        toast.success('Brand added.')
      } else if (editId) {
        await api.put(`/api/v1/admin/brands/${editId}`, payload)
        toast.success('Brand updated.')
      }
      setIsSheetOpen(false)
      loadBrands()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save brand.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (brand: Brand) => {
    if (!window.confirm(`Delete "${brand.name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/api/v1/admin/brands/${brand.id}`)
      setBrands((prev) => prev.filter((b) => b.id !== brand.id))
      toast.success('Brand deleted.')
    } catch {
      toast.error('Failed to delete brand.')
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Tag className="w-5 h-5 text-accent" />
            <span>Brands</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">{brands.length} partner brands</p>
        </div>

        <Button onClick={handleOpenAdd} size="sm">
          <PlusCircle className="w-4 h-4" />
          <span>Add Brand</span>
        </Button>
      </div>

      <div className="rounded-md border border-border bg-bg-surface overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-text-muted text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading brands…</span>
          </div>
        ) : brands.length === 0 ? (
          <div className="py-16 text-center text-text-muted text-xs">No brands yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="font-medium text-text-primary whitespace-nowrap">{brand.name}</TableCell>
                  <TableCell className="text-text-secondary whitespace-nowrap">{brand.country || '—'}</TableCell>
                  <TableCell className="max-w-md text-text-secondary truncate">{brand.description || '—'}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    <Badge variant={brand.is_active ? 'success' : 'secondary'}>
                      {brand.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(brand)} title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(brand)} title="Delete">
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
            <SheetTitle>{sheetMode === 'add' ? 'Add Brand' : 'Edit Brand'}</SheetTitle>
            <SheetDescription>Manage partner hardware manufacturers.</SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSave} className="contents">
            <SheetBody className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="brand-name">Name</Label>
                <Input id="brand-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sony Professional" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="brand-country">Country</Label>
                <Input id="brand-country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Japan" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="brand-description">Description</Label>
                <Textarea id="brand-description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short profile of this brand…" />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox checked={isActive} onCheckedChange={(v) => setIsActive(v === true)} />
                <span className="text-xs font-medium text-text-primary">Active — show on public catalog filters</span>
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
