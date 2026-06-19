import { Component, type ErrorInfo, type ReactNode } from 'react'
import { PopupHeader } from './PopupHeader'
import { LoadingButton } from './LoadingButton'
import { logger } from '../utils/logger'

interface PopupErrorBoundaryProps {
  children: ReactNode
}

interface PopupErrorBoundaryState {
  hasError: boolean
}

export class PopupErrorBoundary extends Component<
  PopupErrorBoundaryProps,
  PopupErrorBoundaryState
> {
  state: PopupErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): PopupErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error('Popup crashed', { error, componentStack: info.componentStack })
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false })
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="popup">
          <div className="popup__layout">
            <PopupHeader subtitle="Something went wrong" />
            <div className="popup__error-boundary">
              <p className="popup__error">
                The extension encountered an unexpected error. Your draft may still be saved.
              </p>
              <LoadingButton
                isLoading={false}
                loadingLabel="Retry"
                idleLabel="Retry"
                onClick={this.handleRetry}
              />
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
