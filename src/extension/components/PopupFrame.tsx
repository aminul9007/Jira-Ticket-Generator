import type { ReactNode } from 'react'
import { PopupAttributionFooter } from './PopupAttributionFooter'

interface PopupFrameProps {
  header: ReactNode
  children: ReactNode
  scroll?: boolean
}

export function PopupFrame({ header, children, scroll = false }: PopupFrameProps) {
  return (
    <div className="popup">
      <div className="popup__layout popup__layout--with-footer">
        {header}
        {scroll ? <div className="popup__scroll">{children}</div> : <div className="popup__main">{children}</div>}
        <PopupAttributionFooter />
      </div>
    </div>
  )
}
