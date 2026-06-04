import { useCallback, useState } from 'react'
import type { BugReportFormValues, Environment } from '../types/bugReport'
import { isBugReportFormComplete } from '../utils/validateForm'

const initialValues: BugReportFormValues = {
  issueDescription: '',
  environments: [],
}

export function useBugReportForm() {
  const [values, setValues] = useState<BugReportFormValues>(initialValues)

  const setIssueDescription = useCallback((issueDescription: string) => {
    setValues((prev) => ({ ...prev, issueDescription }))
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

  const setEnvironments = useCallback((environments: Environment[]) => {
    setValues((prev) => ({ ...prev, environments }))
  }, [])

  const reset = useCallback(() => {
    setValues(initialValues)
  }, [])

  const isValid = isBugReportFormComplete(values)

  return {
    values,
    isValid,
    setIssueDescription,
    setEnvironments,
    toggleEnvironment,
    reset,
  }
}
