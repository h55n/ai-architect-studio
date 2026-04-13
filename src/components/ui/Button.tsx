'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: React.ReactNode
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--color-accent)] text-white
    hover:bg-[#1648c0] active:bg-[#1241ab]
    shadow-lg shadow-[var(--color-accent)]/20
  `,
  secondary: `
    bg-[var(--color-violet-dark)] text-white
    hover:bg-[#3d3b5c] active:bg-[#302e4a]
  `,
  ghost: `
    bg-transparent text-[var(--text-primary)]
    hover:bg-[var(--color-violet-light)]/10
    border border-[var(--border-color)]
  `,
  glass: `
    glass text-[var(--text-primary)]
    hover:bg-[var(--color-violet-light)]/20
  `,
  danger: `
    bg-[var(--color-orange)] text-white
    hover:bg-[#d94f20] active:bg-[#c14519]
  `,
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-[var(--radius-sm)]',
  md: 'px-5 py-2.5 text-base rounded-[var(--radius-md)]',
  lg: 'px-8 py-3.5 text-lg rounded-[var(--radius-md)]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-body font-medium',
          'transition-all duration-[var(--transition-fast)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'cursor-pointer select-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
