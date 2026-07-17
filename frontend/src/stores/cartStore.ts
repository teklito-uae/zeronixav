import { create } from 'zustand'

const STORAGE_KEY = 'zeronix-cart'

export interface CartItem {
  productId: number
  sku: string
  slug: string
  title: string
  brand: string
  price: number
  image: string
  qty: number
}

function getInitialItems(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function persist(items: CartItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  removeItem: (productId: number) => void
  updateQty: (productId: number, qty: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: getInitialItems(),
  addItem: (item, qty = 1) =>
    set((s) => {
      const existing = s.items.find((i) => i.productId === item.productId)
      const items = existing
        ? s.items.map((i) =>
            i.productId === item.productId ? { ...i, qty: i.qty + qty } : i
          )
        : [...s.items, { ...item, qty }]
      persist(items)
      return { items }
    }),
  removeItem: (productId) =>
    set((s) => {
      const items = s.items.filter((i) => i.productId !== productId)
      persist(items)
      return { items }
    }),
  updateQty: (productId, qty) =>
    set((s) => {
      const items = qty <= 0
        ? s.items.filter((i) => i.productId !== productId)
        : s.items.map((i) => (i.productId === productId ? { ...i, qty } : i))
      persist(items)
      return { items }
    }),
  clear: () =>
    set(() => {
      persist([])
      return { items: [] }
    }),
}))
