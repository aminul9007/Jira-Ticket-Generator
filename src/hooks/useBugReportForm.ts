import { useCallback, useState } from 'react'
import type { BugCategory, BugReportFormValues, Environment } from '../types/bugReport'
import { isBugReportFormComplete } from '../utils/validateForm'

const initialValues: BugReportFormValues = {
  category: '',
  environments: [],
  title: '',
  additionalNotes: '',
}

export function useBugReportForm() {
  const [values, setValues] = useState<BugReportFormValues>(initialValues)

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
  }, [])

  const isValid = isBugReportFormComplete(values)

  return {
    values,
    isValid,
    setCategory,
    toggleEnvironment,
    setTitle,
    setAdditionalNotes,
    reset,
  }
}
