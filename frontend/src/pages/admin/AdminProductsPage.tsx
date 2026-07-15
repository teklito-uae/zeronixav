import { useState, useEffect } from 'react'
import { Box, Search, PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Product, Category, Brand } from '@/types/api'
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
import ProductImageField from '@/components/admin/ProductImageField'

const SUB_IMAGE_COUNT = 4

interface ProductFormState {
  sku: string
  title: string
  brand: string
  category_id: string
  price: string
  stock: string
  specKey1: string
  specVal1: string
  specKey2: string
  specVal2: string
  mainImage: string
  subImages: string[]
}

const EMPTY_FORM: ProductFormState = {
  sku: '',
  title: '',
  brand: '',
  category_id: '',
  price: '',
  stock: '0',
  specKey1: '',
  specVal1: '',
  specKey2: '',
  specVal2: '',
  mainImage: '',
  subImages: Array(SUB_IMAGE_COUNT).fill(''),
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add')
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM)
  const [isSaving, setIsSaving] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        api.get<{ products: Product[] }>('/api/v1/admin/products'),
        api.get<{ categories: Category[] }>('/api/v1/admin/categories'),
        api.get<{ brands: Brand[] }>('/api/v1/admin/brands'),
      ])
      setProducts(productsRes.products)
      setCategories(categoriesRes.categories)
      setBrands(brandsRes.brands)
    } catch {
      toast.error('Could not reach the API. Is the backend running?')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOpenAdd = () => {
    setSheetMode('add')
    setEditId(null)
    setForm({ ...EMPTY_FORM, brand: brands[0]?.name ?? '', category_id: categories[0] ? String(categories[0].id) : '' })
    setIsSheetOpen(true)
  }

  const handleOpenEdit = (product: Product) => {
    setSheetMode('edit')
    setEditId(product.id)
    const specs = Object.entries(product.tech_specs || {})
    setForm({
      sku: product.sku,
      title: product.title,
      brand: product.brand,
      category_id: product.category_id ? String(product.category_id) : '',
      price: String(product.price),
      stock: String(product.stock),
      specKey1: specs[0]?.[0] ?? '',
      specVal1: specs[0]?.[1] ?? '',
      specKey2: specs[1]?.[0] ?? '',
      specVal2: specs[1]?.[1] ?? '',
      mainImage: product.images?.[0] ?? '',
      subImages: Array.from({ length: SUB_IMAGE_COUNT }, (_, i) => product.images?.[i + 1] ?? ''),
    })
    setIsSheetOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const techSpecs: Record<string, string> = {}
    if (form.specKey1) techSpecs[form.specKey1] = form.specVal1
    if (form.specKey2) techSpecs[form.specKey2] = form.specVal2

    const payload = {
      sku: form.sku,
      title: form.title,
      brand: form.brand,
      category_id: form.category_id ? Number(form.category_id) : null,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      tech_specs: techSpecs,
      images: [form.mainImage, ...form.subImages].filter(Boolean),
    }

    try {
      if (sheetMode === 'add') {
        await api.post('/api/v1/admin/products', payload)
        toast.success('Product added.')
      } else if (editId) {
        await api.put(`/api/v1/admin/products/${editId}`, payload)
        toast.success('Product updated.')
      }
      setIsSheetOpen(false)
      loadData()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save product.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) return
    try {
      await api.delete(`/api/v1/admin/products/${product.id}`)
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
      toast.success('Product deleted.')
    } catch {
      toast.error('Failed to delete product.')
    }
  }

  const filtered = products.filter((p) =>
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Box className="w-5 h-5 text-accent" />
            <span>Products</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">{products.length} SKUs in the catalog</p>
        </div>

        <Button onClick={handleOpenAdd} size="sm">
          <PlusCircle className="w-4 h-4" />
          <span>Add Product</span>
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by SKU or title…"
          className="pl-9"
        />
      </div>

      <div className="rounded-md border border-border bg-bg-surface overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-text-muted text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading products…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-text-muted text-xs">No products found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono font-medium text-accent whitespace-nowrap">{product.sku}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="font-medium text-text-primary truncate">{product.title}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{product.brand}</TableCell>
                  <TableCell className="whitespace-nowrap text-text-secondary">
                    {product.category?.name ?? '—'}
                  </TableCell>
                  <TableCell className="text-right font-mono whitespace-nowrap">
                    {Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    <Badge variant={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'destructive'}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(product)} title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product)} title="Delete">
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
            <SheetTitle>{sheetMode === 'add' ? 'Add Product' : 'Edit Product'}</SheetTitle>
            <SheetDescription>
              {sheetMode === 'add' ? 'Create a new hardware SKU record.' : 'Update SKU pricing, stock, and specs.'}
            </SheetDescription>
          </SheetHeader>

          <form id="product-form" onSubmit={handleSave} className="contents">
            <SheetBody className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="YEA-MVC860" />
                </div>
                <div className="space-y-1.5">
                  <Label>Brand</Label>
                  <Select value={form.brand} onValueChange={(v) => setForm({ ...form, brand: v })}>
                    <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Product name" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                    <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-border">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                  Product images
                </span>
                <ProductImageField
                  label="Main image"
                  value={form.mainImage}
                  onChange={(url) => setForm({ ...form, mainImage: url })}
                />
                {form.subImages.map((url, i) => (
                  <ProductImageField
                    key={i}
                    label={`Sub image ${i + 1}`}
                    value={url}
                    onChange={(newUrl) =>
                      setForm({
                        ...form,
                        subImages: form.subImages.map((v, idx) => (idx === i ? newUrl : v)),
                      })
                    }
                  />
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                  Tech specs (optional)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={form.specKey1} onChange={(e) => setForm({ ...form, specKey1: e.target.value })} placeholder="Key, e.g. Resolution" />
                  <Input value={form.specVal1} onChange={(e) => setForm({ ...form, specVal1: e.target.value })} placeholder="Value" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={form.specKey2} onChange={(e) => setForm({ ...form, specKey2: e.target.value })} placeholder="Key, e.g. Audio" />
                  <Input value={form.specVal2} onChange={(e) => setForm({ ...form, specVal2: e.target.value })} placeholder="Value" />
                </div>
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
