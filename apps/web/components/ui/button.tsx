import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'
import React from 'react'

const buttonStyles = cva(
  'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600',
        ghost: 'text-indigo-700 hover:bg-indigo-50',
        outline: 'border border-slate-200 text-slate-800 hover:bg-slate-50'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonStyles> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={clsx(buttonStyles({ variant }), className)} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'
