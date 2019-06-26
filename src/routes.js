import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import auth from './app/middlewares/auth'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

const routes = new Router()
const upload = multer(multerConfig)

routes.post('/api/auth', SessionController.store)
routes.post('/api/users', UserController.store)

routes.use(auth)

routes.put('/api/users', UserController.update)
routes.post('/api/users/avatar', upload.single('file'), (req, res) =>
  res.send()
)

export default routes
