import { useState } from 'react'
import { useBrowserContext } from '../hooks/useBrowserContext'
import './Popup.css'

export function Popup() {
  const [description, setDescription] = useState('')
  const { url, title, timestamp } = useBrowserContext()

  return (
    <div className="popup">
      <div className="popup__layout">
        <header className="popup__header">
          <h1 className="popup__title">QA Bug Assistant</h1>
          <p className="popup__subtitle">Phase 2 foundation — generation coming soon</p>
        </header>

        <section className="popup__section">
          <label className="popup__label" htmlFor="voice-placeholder">
            Voice input
          </label>
          <button
            id="voice-placeholder"
            type="button"
            className="popup__voice-button"
            disabled
            aria-disabled="true"
          >
            Voice Button Placeholder
          </button>
        </section>

        <section className="popup__section">
          <label className="popup__label" htmlFor="issue-description">
            Issue description
          </label>
          <textarea
            id="issue-description"
            className="popup__textarea"
            placeholder="Describe the bug you found on this page…"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={6}
          />
        </section>

        <section className="popup__section">
          <button type="button" className="popup__generate-button" disabled aria-disabled="true">
            Coming Soon
          </button>
        </section>

        <footer className="popup__footer">
          <p className="popup__footer-title">Captured context</p>
          <div className="popup__meta">
            <p className="popup__meta-row">
              <span className="popup__meta-label">Page</span>
              <span className="popup__meta-value">{url || 'Unavailable'}</span>
            </p>
            <p className="popup__meta-row">
              <span className="popup__meta-label">Title</span>
              <span className="popup__meta-value">{title || 'Unavailable'}</span>
            </p>
            <p className="popup__meta-row">
              <span className="popup__meta-label">Captured</span>
              <span className="popup__meta-value">{timestamp || '—'}</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
