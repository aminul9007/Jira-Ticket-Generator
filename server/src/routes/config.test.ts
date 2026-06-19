import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from '../app.js'

describe('GET /api/config/bootstrap', () => {
  it('returns non-secret Jira defaults for the extension', async () => {
    const app = createApp()
    const result = await request(app).get('/api/config/bootstrap')

    expect(result.status).toBe(200)
    expect(result.body.jira).toEqual({
      domain: expect.any(String),
      email: expect.any(String),
      configured: expect.any(Boolean),
    })
    expect(result.body.ticketDefaults).toEqual({
      projectKey: expect.any(String),
      issueType: expect.any(String),
    })
    expect(JSON.stringify(result.body)).not.toMatch(/apiToken|token/i)
  })
})
