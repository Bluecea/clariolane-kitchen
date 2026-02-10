import { type HTMLAttributes, forwardRef } from 'react'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-lg border border-slate-100 bg-white shadow-sm ${className}`}
        {...props}>
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'
