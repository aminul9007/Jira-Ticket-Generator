import { describe, expect, it } from 'vitest'
import { applyTicketContextOptions } from './applyTicketContextOptions'

describe('applyTicketContextOptions', () => {
  const context = {
    url: 'https://example.com/dashboard',
    title: 'Dashboard',
    timestamp: '2026-06-19T10:00:00.000Z',
  }

  it('keeps page title by default', () => {
    expect(applyTicketContextOptions(context)).toEqual(context)
  })

  it('removes page title when includePageTitle is false', () => {
    expect(
      applyTicketContextOptions(context, { includePageTitle: false }),
    ).toEqual({
      ...context,
      title: '',
    })
  })
})
