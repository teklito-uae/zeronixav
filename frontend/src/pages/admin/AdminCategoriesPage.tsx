import { useState, useEffect } from 'react'
import { FolderTree, PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Category } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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

const NO_PARENT = 'none'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add')
  const [editId, setEditId] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [parentId, setParentId] = useState(NO_PARENT)

  const loadCategories = async () => {
    setIsLoading(true)
    try {
      const res = await api.get<{ categories: Category[] }>('/api/v1/admin/categories')
      setCategories(res.categories)
    } catch {
      toast.error('Could not reach the API. Is the backend running?')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleOpenAdd = () => {
    setSheetMode('add')
    setEditId(null)
    setName('')
    setSlug('')
    setParentId(NO_PARENT)
    setIsSheetOpen(true)
  }

  const handleOpenEdit = (cat: Category) => {
    setSheetMode('edit')
    setEditId(cat.id)
    setName(cat.name)
    setSlug(cat.slug)
    setParentId(cat.parent_id ? String(cat.parent_id) : NO_PARENT)
    setIsSheetOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      name,
      slug: slug || undefined,
      parent_id: parentId === NO_PARENT ? null : Number(parentId),
    }

    try {
      if (sheetMode === 'add') {
        await api.post('/api/v1/admin/categories', payload)
        toast.success('Category created.')
      } else if (editId) {
        await api.put(`/api/v1/admin/categories/${editId}`, payload)
        toast.success('Category updated.')
      }
      setIsSheetOpen(false)
      loadCategories()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save category.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`Delete "${cat.name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/api/v1/admin/categories/${cat.id}`)
      setCategories((prev) => prev.filter((c) => c.id !== cat.id))
      toast.success('Category deleted.')
    } catch {
      toast.error('Failed to delete category.')
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-accent" />
            <span>Categories</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">{categories.length} categories</p>
        </div>

        <Button onClick={handleOpenAdd} size="sm">
          <PlusCircle className="w-4 h-4" />
          <span>Add Category</span>
        </Button>
      </div>

      <div className="rounded-md border border-border bg-bg-surface overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-text-muted text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading categories…</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-text-muted text-xs">No categories yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium text-text-primary">{cat.name}</TableCell>
                  <TableCell className="font-mono text-text-secondary">/{cat.slug}</TableCell>
                  <TableCell className="text-text-secondary">
                    {cat.parent_id ? categories.find((c) => c.id === cat.parent_id)?.name ?? '—' : '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge>{cat.products_count ?? 0}</Badge>
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(cat)} title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cat)} title="Delete">
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
            <SheetTitle>{sheetMode === 'add' ? 'Add Category' : 'Edit Category'}</SheetTitle>
            <SheetDescription>Organize product lines into a category tree.</SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSave} className="contents">
            <SheetBody className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="cat-name">Name</Label>
                <Input
                  id="cat-name"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (sheetMode === 'add') {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                    }
                  }}
                  placeholder="e.g. Audio Distribution"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cat-slug">Slug</Label>
                <Input id="cat-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto-generated" className="font-mono" />
              </div>

              <div className="space-y-1.5">
                <Label>Parent category</Label>
                <Select value={parentId} onValueChange={setParentId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_PARENT}>None (top-level)</SelectItem>
                    {categories.filter((c) => c.id !== editId).map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
