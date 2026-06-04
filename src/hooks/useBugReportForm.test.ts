import { describe, expect, it } from 'vitest'
import type { Environment } from '../types/bugReport'
import { buildVoiceFormValues } from './useBugReportForm'
import { extractContext } from '../utils/contextDetection/extractContext'
import { resolveBugInput } from '../utils/inferBugDetails'
import { isBugReportFormComplete } from '../utils/validateForm'

describe('bug report form contract', () => {
  it('form values include issue description, environments, and qa context', () => {
    const values = {
      issueDescription: 'Checkout pay button stays disabled on Safari',
      environments: ['Production'] as Environment[],
      qaContext: extractContext('Checkout pay button stays disabled on Safari'),
    }

    expect(isBugReportFormComplete(values)).toBe(true)
    expect(Object.keys(values).sort()).toEqual(['environments', 'issueDescription', 'qaContext'])
  })

  it('buildVoiceFormValues derives environments and context from transcript synchronously', () => {
    const values = buildVoiceFormValues(
      'On production checkout fails in Firefox on desktop',
    )
    expect(values.environments).toEqual(['Production'])
    expect(values.environments).toEqual(['Production'])
    expect(values.qaContext.environment).toEqual({ value: 'production', source: 'user' })
    expect(values.qaContext.browser).toEqual({ value: 'Firefox', source: 'user' })
    expect(values.issueDescription).toContain('production')
  })

  it('inferred fields live on ResolvedBugInput, not on form values', () => {
    const formValues = {
      issueDescription: 'UI layout broken on checkout page in production',
      environments: [] as Environment[],
      qaContext: extractContext('UI layout broken on checkout page in production'),
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
