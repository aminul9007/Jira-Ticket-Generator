import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../app.js'

describe('POST /api/jira/issues', () => {
  it('creates a mock issue when MCP mock mode is enabled', async () => {
    const app = createApp()

    const response = await request(app)
      .post('/api/jira/issues')
      .send({
        title: 'Checkout broken',
        summary: 'Payment fails on submit',
        steps: ['Add item', 'Checkout'],
        expected: 'Order completes',
        actual: 'Spinner never ends',
        severity: 'High',
        priority: 'P1',
        environment: 'Production',
        browser: 'Chrome',
        os: 'macOS',
        device: 'Desktop',
      })

    expect(response.status).toBe(201)
    expect(response.body.issueKey).toBe('QA-123')
    expect(response.body.issueUrl).toContain('company.atlassian.net/browse/QA-123')
  })

  it('returns validation error for missing title', async () => {
    const app = createApp()

    const response = await request(app)
      .post('/api/jira/issues')
      .send({
        title: '',
        summary: 'Missing title',
        steps: [],
        expected: '',
        actual: '',
        severity: '',
        priority: '',
        environment: '',
        browser: '',
        os: '',
        device: '',
      })

    expect(response.status).toBe(400)
    expect(response.body.code).toBe('VALIDATION_ERROR')
  })
})
