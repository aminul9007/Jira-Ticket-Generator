import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PopupErrorBoundary } from '../components/PopupErrorBoundary'
import { Popup } from './Popup'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Extension popup root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <PopupErrorBoundary>
      <Popup />
    </PopupErrorBoundary>
  </StrictMode>,
)
