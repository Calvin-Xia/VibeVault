import { clsx } from 'clsx'
import React from 'react'

type PanelProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string
}

export const Panel: React.FC<PanelProps> = ({ title, className, children, ...rest }) => (
  <div
    className={clsx(
      'rounded-xl border border-gray-200 bg-white/60 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60',
      className
    )}
    {...rest}
  >
    {title ? <div className="border-b px-4 py-2 text-sm font-semibold text-gray-700 dark:text-slate-100">{title}</div> : null}
    <div className="p-4 text-gray-800 dark:text-slate-100">{children}</div>
  </div>
)
