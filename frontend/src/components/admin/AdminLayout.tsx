import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import { Toaster } from '@/components/ui/sonner'
import { useAuthStore } from '@/store/authStore'

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <>
        <AdminLoginPage />
        <Toaster />
      </>
    )
  }

  return (
    <div className="flex h-screen w-full bg-bg-primary overflow-hidden font-sans text-text-primary selection:bg-accent/20 selection:text-accent">
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  )
}
