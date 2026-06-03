import { useCallback, useEffect, useState } from 'react'

interface ToastState {
  message: string
  id: number
}

export function useToast(durationMs = 3200) {
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback((message: string) => {
    setToast({ message, id: Date.now() })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), durationMs)
    return () => window.clearTimeout(timer)
  }, [toast, durationMs])

  return { toast, showToast }
}
