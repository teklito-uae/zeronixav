import { create } from 'zustand'

interface UIState {
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  closeMobileMenu:  () => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set(s => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu:  () => set({ isMobileMenuOpen: false }),
}))
