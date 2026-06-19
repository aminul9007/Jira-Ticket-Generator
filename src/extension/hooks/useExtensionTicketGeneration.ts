import { useCallback, useState } from 'react'
import type { GeneratedTicket } from '../../types/bugReport'
import type { TicketContext } from '../../../shared/generation/types'
import { generateExtensionTicket } from '../services/generateExtensionTicket'

export type ExtensionGenerationStatus = 'idle' | 'loading' | 'success' | 'error'

interface UseExtensionTicketGenerationResult {
  status: ExtensionGenerationStatus
  errorMessage: string | null
  ticket: GeneratedTicket | null
  usedAi: boolean
  generate: (description: string, context: TicketContext) => Promise<void>
  resetError: () => void
}

export function useExtensionTicketGeneration(): UseExtensionTicketGenerationResult {
  const [status, setStatus] = useState<ExtensionGenerationStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [ticket, setTicket] = useState<GeneratedTicket | null>(null)
  const [usedAi, setUsedAi] = useState(false)

  const generate = useCallback(async (description: string, context: TicketContext) => {
    setStatus('loading')
    setErrorMessage(null)

    try {
      const result = await generateExtensionTicket({ description, context })
      setTicket(result.ticket)
      setUsedAi(result.usedAi)
      setStatus('success')
    } catch {
      setTicket(null)
      setUsedAi(false)
      setStatus('error')
      setErrorMessage('Unable to generate ticket')
    }
  }, [])

  const resetError = useCallback(() => {
    setStatus('idle')
    setErrorMessage(null)
  }, [])

  return {
    status,
    errorMessage,
    ticket,
    usedAi,
    generate,
    resetError,
  }
}
