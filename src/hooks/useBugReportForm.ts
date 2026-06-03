import { useCallback, useState } from 'react'
import type { BugCategory, BugReportFormValues, Environment } from '../types/bugReport'

const initialValues: BugReportFormValues = {
  category: '',
  environments: [],
  title: '',
  additionalNotes: '',
}

export function useBugReportForm() {
  const [values, setValues] = useState<BugReportFormValues>(initialValues)
  const [isGenerating, setIsGenerating] = useState(false)

  const setCategory = useCallback((category: BugCategory | '') => {
    setValues((prev) => ({ ...prev, category }))
  }, [])

  const toggleEnvironment = useCallback((env: Environment) => {
    setValues((prev) => {
      const exists = prev.environments.includes(env)
      return {
        ...prev,
        environments: exists
          ? prev.environments.filter((e) => e !== env)
          : [...prev.environments, env],
      }
    })
  }, [])

  const setTitle = useCallback((title: string) => {
    setValues((prev) => ({ ...prev, title }))
  }, [])

  const setAdditionalNotes = useCallback((additionalNotes: string) => {
    setValues((prev) => ({ ...prev, additionalNotes }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
    setIsGenerating(false)
  }, [])

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setIsGenerating(false)
    return true
  }, [])

  const isValid =
    values.category !== '' &&
    values.environments.length > 0 &&
    values.title.trim().length > 0

  return {
    values,
    isGenerating,
    isValid,
    setCategory,
    toggleEnvironment,
    setTitle,
    setAdditionalNotes,
    reset,
    handleGenerate,
  }
}
