import { describe, expect, it } from 'vitest'
import type { Environment } from '../types/bugReport'
import { resolveBugInput } from '../utils/inferBugDetails'
import { isBugReportFormComplete } from '../utils/validateForm'

describe('bug report form contract', () => {
  it('form values only contain issueDescription and environments', () => {
    const values = {
      issueDescription: 'Checkout pay button stays disabled on Safari',
      environments: ['Production'] as Environment[],
    }

    expect(isBugReportFormComplete(values)).toBe(true)
    expect(Object.keys(values).sort()).toEqual(['environments', 'issueDescription'])
  })

  it('inferred fields live on ResolvedBugInput, not on form values', () => {
    const formValues = {
      issueDescription: 'UI layout broken on checkout page in production',
      environments: [] as Environment[],
    }

    const resolved = resolveBugInput(formValues)

    expect(resolved.category).toBeTruthy()
    expect(resolved.shortTitle).toBeTruthy()
    expect(resolved.affectedFeaturePage).toBeTruthy()
    expect(resolved).toHaveProperty('issueDescription')
    expect(formValues).not.toHaveProperty('category')
    expect(formValues).not.toHaveProperty('title')
  })
})
