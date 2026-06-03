import { useState } from 'react'
import { DashboardPage } from './pages/DashboardPage'
import { SettingsPage } from './pages/SettingsPage'
import type { AppPage } from './types/appPage'

function App() {
  const [page, setPage] = useState<AppPage>('dashboard')

  if (page === 'settings') {
    return <SettingsPage onBack={() => setPage('dashboard')} />
  }

  return <DashboardPage onOpenSettings={() => setPage('settings')} />
}

export default App
