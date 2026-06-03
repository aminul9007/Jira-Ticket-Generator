import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
