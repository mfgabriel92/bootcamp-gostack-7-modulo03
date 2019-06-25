import { Router } from 'express'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

const routes = new Router()

routes.post('/api/auth', SessionController.store)
routes.post('/api/users', UserController.store)

export default routes
