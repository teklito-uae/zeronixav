import { useState, useEffect } from 'react'
import { ClipboardList, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { getPaginationRange } from '@/lib/pagination'
import type { PaginatedResponse } from '@/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

export interface OrderItem {
  id: number
  order_id: number
  product_id: number | null
  sku: string
  title: string
  price: number | string
  quantity: number
  line_total: number | string
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  order_number: string
  customer_name: string
  email: string
  phone: string
  company: string | null
  country: string
  address_line1: string
  address_line2: string | null
  city: string
  notes: string | null
  payment_method: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number | string
  total: number | string
  items: OrderItem[]
  created_at: string
  updated_at: string
}

const STATUS_OPTIONS: Order['status'][] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

function statusVariant(status: Order['status']): 'default' | 'secondary' | 'success' | 'warning' | 'destructive' {
  switch (status) {
    case 'pending':
      return 'secondary'
    case 'confirmed':
    case 'processing':
      return 'warning'
    case 'shipped':
      return 'default'
    case 'delivered':
      return 'success'
    case 'cancelled':
      return 'destructive'
    default:
      return 'default'
  }
}

function formatStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatMoney(value: number | string): string {
  return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [meta, setMeta] = useState<PaginatedResponse<Order>['meta'] | null>(null)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const loadOrders = async (targetPage: number, search: string, status: string) => {
    setIsLoading(true)
    try {
      const res = await api.get<PaginatedResponse<Order>>('/api/v1/admin/orders', {
        search: search || undefined,
        status: status !== 'All' ? status : undefined,
        page: targetPage,
      })
      if (res.data.length === 0 && targetPage > 1) {
        setPage(targetPage - 1)
        return
      }
      setOrders(res.data)
      setMeta(res.meta)
    } catch {
      toast.error('Could not reach the API. Is the backend running?')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      loadOrders(page, searchQuery, statusFilter)
    }, 300)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery, statusFilter])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setPage(1)
  }

  const handleOpenOrder = async (order: Order) => {
    setIsSheetOpen(true)
    setIsLoadingOrder(true)
    setSelectedOrder(order)
    try {
      const res = await api.get<{ order: Order }>(`/api/v1/admin/orders/${order.id}`)
      setSelectedOrder(res.order)
    } catch {
      toast.error('Failed to load order details.')
    } finally {
      setIsLoadingOrder(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return
    setIsUpdatingStatus(true)
    try {
      const res = await api.patch<{ message: string; order: Order }>(
        `/api/v1/admin/orders/${selectedOrder.id}`,
        { status: newStatus }
      )
      setSelectedOrder(res.order)
      setOrders((prev) => prev.map((o) => (o.id === res.order.id ? res.order : o)))
      toast.success('Order status updated.')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update order status.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const paginationRange = meta ? getPaginationRange(meta.current_page, meta.last_page) : []

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-accent" />
            <span>Orders</span>
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">{meta?.total ?? 0} orders placed</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by order #, customer, or email…"
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>{formatStatusLabel(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-border bg-bg-surface overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-text-muted text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading orders…</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-text-muted text-xs">No orders found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Payment</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Placed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer" onClick={() => handleOpenOrder(order)}>
                  <TableCell className="font-mono font-medium text-accent whitespace-nowrap">
                    {order.order_number}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="font-medium text-text-primary truncate">{order.customer_name}</div>
                    <div className="text-[11px] text-text-muted truncate">{order.email}</div>
                  </TableCell>
                  <TableCell className="text-right font-mono whitespace-nowrap">{formatMoney(order.total)}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    <Badge variant="secondary">COD</Badge>
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    <Badge variant={statusVariant(order.status)}>{formatStatusLabel(order.status)}</Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-text-secondary">
                    {new Date(order.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {meta && meta.last_page > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            Showing <span className="font-medium text-text-secondary">{(meta.current_page - 1) * meta.per_page + 1}</span>
            {'–'}
            <span className="font-medium text-text-secondary">
              {Math.min(meta.current_page * meta.per_page, meta.total)}
            </span>{' '}
            of <span className="font-medium text-text-secondary">{meta.total}</span>
          </p>

          <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              className="p-2 rounded-full border border-border bg-bg-surface text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {paginationRange.map((entry, i) =>
              entry === '...' ? (
                <span key={`ellipsis-${i}`} className="px-1.5 text-xs text-text-muted select-none">
                  …
                </span>
              ) : (
                <button
                  key={entry}
                  onClick={() => setPage(entry)}
                  aria-current={entry === meta.current_page ? 'page' : undefined}
                  className={`min-w-[2.25rem] h-9 px-2 rounded-full text-xs font-semibold transition-colors ${
                    entry === meta.current_page
                      ? 'bg-accent text-white'
                      : 'border border-border bg-bg-surface text-text-secondary hover:border-accent hover:text-accent'
                  }`}
                >
                  {entry}
                </button>
              )
            )}

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= meta.last_page}
              className="p-2 rounded-full border border-border bg-bg-surface text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-accent transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        </div>
      )}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedOrder ? selectedOrder.order_number : 'Order'}</SheetTitle>
            <SheetDescription>Shipping details, line items, and order status.</SheetDescription>
          </SheetHeader>

          {isLoadingOrder || !selectedOrder ? (
            <SheetBody className="py-8">
              <div className="flex items-center justify-center text-text-muted text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading order…</span>
              </div>
            </SheetBody>
          ) : (
            <>
              <SheetBody className="space-y-5 py-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">Status</span>
                  <Select value={selectedOrder.status} onValueChange={handleStatusChange} disabled={isUpdatingStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>{formatStatusLabel(s)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    Contact & Shipping
                  </span>
                  <div className="text-xs text-text-primary space-y-0.5">
                    <div className="font-medium">{selectedOrder.customer_name}</div>
                    <div className="text-text-secondary">{selectedOrder.email}</div>
                    <div className="text-text-secondary">{selectedOrder.phone}</div>
                    {selectedOrder.company && <div className="text-text-secondary">{selectedOrder.company}</div>}
                    <div className="text-text-secondary pt-1">
                      {selectedOrder.address_line1}
                      {selectedOrder.address_line2 ? `, ${selectedOrder.address_line2}` : ''}
                    </div>
                    <div className="text-text-secondary">
                      {selectedOrder.city}, {selectedOrder.country}
                    </div>
                    {selectedOrder.notes && (
                      <div className="text-text-muted pt-1 italic">"{selectedOrder.notes}"</div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wide">
                    Line Items
                  </span>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2 text-xs">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-text-primary truncate">{item.title}</div>
                          <div className="text-text-muted font-mono">{item.sku} × {item.quantity}</div>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <div className="text-text-secondary">{formatMoney(item.price)} ea</div>
                          <div className="font-medium text-text-primary">{formatMoney(item.line_total)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-border text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="font-mono text-text-primary">{formatMoney(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-text-primary">Total</span>
                    <span className="font-mono text-text-primary">{formatMoney(selectedOrder.total)}</span>
                  </div>
                </div>
              </SheetBody>

              <SheetFooter>
                <Button type="button" variant="secondary" onClick={() => setIsSheetOpen(false)}>Close</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
