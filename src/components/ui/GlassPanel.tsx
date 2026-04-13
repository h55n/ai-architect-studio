import { cn } from '@/lib/utils'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function GlassPanel({ children, className, id }: GlassPanelProps) {
  return (
    <div
      id={id}
      className={cn(
        'glass rounded-[var(--radius-lg)] p-6',
        className
      )}
    >
      {children}
    </div>
  )
}
