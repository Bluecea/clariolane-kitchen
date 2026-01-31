import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, id, ...props }, ref) => {
    return (
      <div className='w-full space-y-1'>
        {label && (
          <label
            htmlFor={id}
            className='block text-sm font-medium text-slate-700'>
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-50 ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:border-indigo-500'
          } ${className}`}
          {...props}
        />
        {error && <p className='text-sm text-red-500'>{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
