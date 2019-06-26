import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import auth from './app/middlewares/auth'
import SessionController from './app/controllers/SessionController'
import UserController from './app/controllers/UserController'
import FileController from './app/controllers/FileController'
import ProviderController from './app/controllers/ProviderController'

const routes = new Router()
const upload = multer(multerConfig)

routes.post('/api/auth', SessionController.store)
routes.post('/api/users', UserController.store)

routes.use(auth)

routes.put('/api/users', UserController.update)
routes.post('/api/users/avatar', upload.single('file'), FileController.store)
routes.get('/api/providers', ProviderController.index)

export default routes
