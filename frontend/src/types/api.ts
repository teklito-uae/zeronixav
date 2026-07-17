export interface Category {
  id: number
  name: string
  slug: string
  parent_id: number | null
  children?: Category[]
  products_count?: number
}

export interface Product {
  id: number
  sku: string
  model_number: string | null
  title: string
  slug: string
  brand: string
  description: string | null
  overview: string | null
  long_description: string | null
  warranty: string | null
  price: string
  stock: number
  category_id: number | null
  category?: Category
  tech_specs: Record<string, string> | null
  images: string[] | null
  first_image?: string
}

export interface ServiceFaq {
  id: number
  question: string
  answer: string
}

export interface Service {
  id: number
  title: string
  slug: string
  type?: 'solution' | 'space_type'
  summary: string | null
  content: string | null
  seo_title: string | null
  seo_description: string | null
  keywords: string[] | null
  products?: Product[]
  faqs?: ServiceFaq[]
}

export interface Blog {
  id: number
  title: string
  slug: string
  content: string | null
  seo_title: string | null
  seo_description: string | null
  published_at: string | null
}

export interface HomepageData {
  services: Service[]
  space_types: Service[]
}

export interface Brand {
  id: number
  name: string
  slug: string
  country: string | null
  description: string | null
  logo_url: string | null
  is_active: boolean
  products_count?: number
}

export interface Banner {
  id: number
  title: string
  image_url: string
  link_url: string | null
  country_code: string | null
  sort_order: number
  is_active: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
}

export interface McpProduct {
  sku: string
  title: string
  brand: string
  tech_specs: Record<string, string> | null
  compatible_services: string[]
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface ScrapeBatch {
  id: number
  category_id: number
  category?: Category
  created_by: number | null
  status: 'draft' | 'queued' | 'running' | 'completed' | 'completed_with_errors' | 'failed' | 'cancelled'
  total_items: number
  processed_items: number
  failed_items: number
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface ScrapeItem {
  id: number
  scrape_batch_id: number
  product_id: number | null
  external_id: string | null
  title: string
  sku: string | null
  model_number: string | null
  brand_name: string | null
  description: string | null
  overview: string | null
  long_description: string | null
  warranty: string | null
  price: string | number | null
  stock: number | null
  tech_specs: Record<string, string> | null
  source_image_urls: string[] | null
  stored_image_urls: string[] | null
  source_url: string | null
  status: 'pending' | 'processing' | 'done' | 'failed' | 'skipped'
  status_message: string | null
  error_message: string | null
}
