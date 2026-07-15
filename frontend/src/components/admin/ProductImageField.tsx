import { useRef, useState } from 'react'
import { Link2, Upload, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProductImageFieldProps {
  label: string
  value: string
  onChange: (url: string) => void
}

export default function ProductImageField({ label, value, onChange }: ProductImageFieldProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setIsUploading(true)
    try {
      const res = await api.upload<{ url: string }>('/api/v1/admin/uploads', file)
      onChange(res.url)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Image upload failed.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex items-center rounded-sm border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={cn(
              'flex items-center gap-1 px-2 py-1 text-[11px] font-medium transition-colors',
              mode === 'url' ? 'bg-accent text-white' : 'bg-bg-surface text-text-secondary hover:bg-bg-raised'
            )}
          >
            <Link2 className="w-3 h-3" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={cn(
              'flex items-center gap-1 px-2 py-1 text-[11px] font-medium transition-colors border-l border-border',
              mode === 'upload' ? 'bg-accent text-white' : 'bg-bg-surface text-text-secondary hover:bg-bg-raised'
            )}
          >
            <Upload className="w-3 h-3" />
            Upload
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {value && (
          <img
            src={value}
            alt={label}
            className="w-9 h-9 rounded-sm object-cover border border-border shrink-0"
            onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
          />
        )}

        {mode === 'url' ? (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileSelected}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 justify-center"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span>{isUploading ? 'Uploading…' : value ? 'Replace image' : 'Choose file'}</span>
            </Button>
          </>
        )}

        {value && (
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange('')} title="Remove">
            <X className="w-4 h-4 text-danger" />
          </Button>
        )}
      </div>
    </div>
  )
}
