import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import auth from './app/middlewares/auth'
import SessionController from './app/controllers/SessionController'
import UserController from './app/controllers/UserController'
import FileController from './app/controllers/FileController'
import ProviderController from './app/controllers/ProviderController'
import AvailableController from './app/controllers/AvailableController'
import AppointmentController from './app/controllers/AppointmentController'
import ScheduleController from './app/controllers/ScheduleController'
import NotificationController from './app/controllers/NotificationController'

const routes = new Router()
const upload = multer(multerConfig).single('file')

routes.post('/api/auth', SessionController.store)
routes.post('/api/users', UserController.store)

routes.use(auth)

routes.put('/api/users', UserController.update)
routes.put('/api/users/avatar', upload, FileController.store)

routes.get('/api/providers', ProviderController.index)
routes.get('/api/providers/:id/available', AvailableController.index)

routes.get('/api/schedules', ScheduleController.index)

routes.get('/api/appointments', AppointmentController.index)
routes.post('/api/appointments', AppointmentController.store)
routes.delete('/api/appointments/:id', AppointmentController.delete)

routes.get('/api/notifications', NotificationController.index)
routes.put('/api/notifications/:id', NotificationController.update)

export default routes
