import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { queryClient } from '@/lib/queryClient'
import { getInitialTheme } from '@/stores/themeStore'
import App from './App.tsx'
import './styles/globals.css'

// Apply the persisted theme before first paint to avoid a flash of the wrong theme.
document.documentElement.classList.toggle('dark', getInitialTheme() === 'dark')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
)
