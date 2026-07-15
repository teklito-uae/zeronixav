import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-bg-surface group-[.toaster]:text-text-primary group-[.toaster]:border-border group-[.toaster]:shadow-card group-[.toaster]:rounded-sm group-[.toaster]:text-xs',
          description: 'group-[.toast]:text-text-secondary',
          actionButton: 'group-[.toast]:bg-accent group-[.toast]:text-white',
          cancelButton: 'group-[.toast]:bg-bg-raised group-[.toast]:text-text-secondary',
          success: 'group-[.toast]:text-success',
          error: 'group-[.toast]:text-danger',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
