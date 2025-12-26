import React from 'react'
import clsx from 'clsx'

export function Card({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={clsx('card bg-white/80 p-4', className)}>{children}</div>
}
