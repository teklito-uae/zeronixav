import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[11px] font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-accent-subtle text-accent border-accent/30',
        secondary: 'bg-bg-raised text-text-secondary border-border',
        success: 'bg-success/15 text-success border-success/30',
        warning: 'bg-warning/15 text-warning border-warning/30',
        destructive: 'bg-danger/15 text-danger border-danger/30',
        outline: 'text-text-primary border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
