import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { resolve } from 'path'
import * as Sentry from '@sentry/node'
import Youch from 'youch'
import 'express-async-errors'
import routes from './routes'
import sentryConfig from './config/sentry'
import HTTP from './utils/httpResponse'
import './database'

class App {
  constructor() {
    this.server = express()

    Sentry.init(sentryConfig)

    this.middlewares()
    this.routes()
    this.exceptions()
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler())
    this.server.use(cors())
    this.server.use(express.json())
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'uploads'))
    )
  }

  routes() {
    this.server.use(routes)
    this.server.use(Sentry.Handlers.errorHandler())
  }

  exceptions() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON()
        return res.status(HTTP.INTERNAL_SERVER_ERROR).json({ errors })
      }

      return res
        .status(HTTP.INTERNAL_SERVER_ERROR)
        .json({ error: 'Internal server error' })
    })
  }
}

export default new App().server
