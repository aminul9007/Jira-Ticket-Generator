import type { ReactNode } from 'react'
import type { AppPage } from '../../types/appPage'
import { Footer } from './Footer'
import { Header } from './Header'

interface DashboardLayoutProps {
  children: ReactNode
  activePage?: AppPage
  onNavigate?: (page: AppPage) => void
}

export function DashboardLayout({
  children,
  activePage = 'dashboard',
  onNavigate,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header activePage={activePage} onNavigate={onNavigate} />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
