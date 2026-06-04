import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme-init'
import './index.css'
import App from './App.tsx'
import { AppSettingsProvider } from './contexts/AppSettingsProvider'
import { QaContextProvider } from './contexts/QaContextProvider'
import { ThemeProvider } from './contexts/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppSettingsProvider>
        <QaContextProvider>
          <App />
        </QaContextProvider>
      </AppSettingsProvider>
    </ThemeProvider>
  </StrictMode>,
)
