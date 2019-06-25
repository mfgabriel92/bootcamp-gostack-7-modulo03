import { Router } from 'express'
import auth from './app/middlewares/auth'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

const routes = new Router()

routes.post('/api/auth', SessionController.store)
routes.post('/api/users', UserController.store)

routes.use(auth)

routes.put('/api/users', UserController.update)

export default routes
