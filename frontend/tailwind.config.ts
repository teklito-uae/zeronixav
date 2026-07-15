import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          primary: 'var(--color-bg-primary)',
          surface: 'var(--color-bg-surface)',
          raised:  'var(--color-bg-raised)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong:  'var(--color-border-strong)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover:   'var(--color-accent-hover)',
          subtle:  'var(--color-accent-subtle)',
          muted:   'var(--color-accent-muted)',
        },
        text: {
          primary:   'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted:     'var(--color-text-muted)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger:  'var(--color-danger)',
      },
      borderRadius: {
        sm:  'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        md:  'var(--radius-md)',
        lg:  'var(--radius-lg)',
        xl:  'var(--radius-xl)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        card: 'var(--shadow-card)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--color-text-secondary)',
            h1: { color: 'var(--color-text-primary)', fontWeight: '700' },
            h2: { color: 'var(--color-text-primary)', fontWeight: '600' },
            h3: { color: 'var(--color-text-primary)', fontWeight: '600' },
            h4: { color: 'var(--color-text-primary)' },
            strong: { color: 'var(--color-text-primary)' },
            a: { color: 'var(--color-accent)', '&:hover': { color: 'var(--color-accent-hover)' } },
            code: { color: 'var(--color-accent)', background: 'var(--color-bg-surface)', padding: '2px 6px', borderRadius: '4px' },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            blockquote: { borderLeftColor: 'var(--color-accent)', color: 'var(--color-text-secondary)' },
            hr: { borderColor: 'var(--color-border)' },
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
