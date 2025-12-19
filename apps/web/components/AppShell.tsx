import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import FilterBar from './FilterBar'

export default function AppShell({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
          <div className="px-4 py-3">
            <FilterBar />
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
