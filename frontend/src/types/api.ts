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
  title: string
  slug: string
  brand: string
  description: string | null
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
