import cors from 'cors'
import express from 'express'
import { appConfig } from './config.js'
import { ApiError } from './errors.js'
import { jiraRouter } from './routes/jira.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          callback(null, true)
          return
        }

        const allowed = appConfig.corsOrigin
        const allowedList = Array.isArray(allowed) ? allowed : [allowed]
        if (allowedList.includes(origin) || origin.startsWith('chrome-extension://')) {
          callback(null, true)
          return
        }

        callback(new Error('Not allowed by CORS'))
      },
      methods: ['GET', 'POST', 'OPTIONS'],
    }),
  )
  app.use(express.json({ limit: '1mb' }))

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api/jira', jiraRouter)

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found', code: 'UNKNOWN_ERROR' })
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (error instanceof ApiError) {
      res.status(error.status).json({ error: error.message, code: error.code })
      return
    }
    res.status(500).json({ error: 'Internal server error', code: 'UNKNOWN_ERROR' })
  })

  return app
}
