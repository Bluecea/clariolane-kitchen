import { type HTMLAttributes, forwardRef } from 'react'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl border border-slate-200 bg-white shadow-lg ${className}`}
        {...props}>
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'
