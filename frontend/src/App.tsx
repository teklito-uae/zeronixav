import { Routes, Route, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import RootLayout from '@/components/layout/RootLayout'
import AdminLayout from '@/components/admin/AdminLayout'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ScrollToTop from '@/components/ScrollToTop'

// Public Pages
const HomePage            = lazy(() => import('@/pages/HomePage'))
const ServiceDetailPage   = lazy(() => import('@/pages/ServiceDetailPage'))
const TeamSpaceDetailPage = lazy(() => import('@/pages/TeamSpaceDetailPage'))
const ProductsCatalogPage = lazy(() => import('@/pages/ProductsCatalogPage'))
const ProductDetailPage   = lazy(() => import('@/pages/ProductDetailPage'))
const SolutionBuilderPage = lazy(() => import('@/pages/SolutionBuilderPage'))
const ContactPage         = lazy(() => import('@/pages/ContactPage'))
const CartPage             = lazy(() => import('@/pages/CartPage'))
const CheckoutPage         = lazy(() => import('@/pages/CheckoutPage'))
const OrderConfirmationPage = lazy(() => import('@/pages/OrderConfirmationPage'))
const NotFoundPage        = lazy(() => import('@/pages/NotFoundPage'))

// Admin Pages
const AdminDashboardPage  = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const AdminProductsPage   = lazy(() => import('@/pages/admin/AdminProductsPage'))
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'))
const AdminBrandsPage     = lazy(() => import('@/pages/admin/AdminBrandsPage'))
const AdminBannersPage    = lazy(() => import('@/pages/admin/AdminBannersPage'))
const AdminServicesPage   = lazy(() => import('@/pages/admin/AdminServicesPage'))
const AdminAiSettingsPage = lazy(() => import('@/pages/admin/AdminAiSettingsPage'))
const AdminProductScraperPage = lazy(() => import('@/pages/admin/AdminProductScraperPage'))
const AdminOrdersPage     = lazy(() => import('@/pages/admin/AdminOrdersPage'))

function PublicLayout() {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  )
}

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ScrollToTop />
      <Routes>
        {/* Admin Console Routes (Isolated from Public Layout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="brands" element={<AdminBrandsPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
          <Route path="scraper" element={<AdminProductScraperPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="ai-settings" element={<AdminAiSettingsPage />} />
          <Route path="*" element={<AdminDashboardPage />} />
        </Route>

        {/* Public B2B Consumer Routes (Wrapped in RootLayout with Navbar & Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/"                 element={<HomePage />} />
          <Route path="/services/:slug"   element={<ServiceDetailPage />} />
          <Route path="/teamspace/:slug"  element={<TeamSpaceDetailPage />} />
          <Route path="/products"         element={<ProductsCatalogPage />} />
          <Route path="/products/:slug"   element={<ProductDetailPage />} />
          <Route path="/solution-builder" element={<SolutionBuilderPage />} />
          <Route path="/contact"          element={<ContactPage />} />
          <Route path="/cart"             element={<CartPage />} />
          <Route path="/checkout"         element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
          <Route path="*"                 element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

