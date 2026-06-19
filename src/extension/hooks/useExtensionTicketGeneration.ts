import { useCallback, useState } from 'react'
import type { GeneratedTicket } from '../../types/bugReport'
import type { ExtractedContext } from '../../types/contextDetection'
import type { TicketContext } from '../../../shared/generation/types'
import { buildFormValuesFromGenerationInput } from '../../services/ticketGeneration/buildFormValuesFromInput'
import { generateExtensionTicket } from '../services/generateExtensionTicket'

export type ExtensionGenerationStatus = 'idle' | 'loading' | 'success' | 'error'

interface UseExtensionTicketGenerationResult {
  status: ExtensionGenerationStatus
  errorMessage: string | null
  ticket: GeneratedTicket | null
  usedAi: boolean
  qaContext: ExtractedContext | null
  generate: (description: string, context: TicketContext) => Promise<void>
  resetError: () => void
}

export function useExtensionTicketGeneration(): UseExtensionTicketGenerationResult {
  const [status, setStatus] = useState<ExtensionGenerationStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [ticket, setTicket] = useState<GeneratedTicket | null>(null)
  const [usedAi, setUsedAi] = useState(false)
  const [qaContext, setQaContext] = useState<ExtractedContext | null>(null)

  const generate = useCallback(async (description: string, context: TicketContext) => {
    setStatus('loading')
    setErrorMessage(null)

    try {
      const formValues = buildFormValuesFromGenerationInput({ description, context })
      const result = await generateExtensionTicket({ description, context })
      setTicket(result.ticket)
      setUsedAi(result.usedAi)
      setQaContext(formValues.qaContext)
      setStatus('success')
    } catch {
      setTicket(null)
      setUsedAi(false)
      setQaContext(null)
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
    qaContext,
    generate,
    resetError,
  }
}
