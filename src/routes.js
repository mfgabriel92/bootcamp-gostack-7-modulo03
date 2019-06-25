import { Router } from 'express'
import User from './app/models/User'

const routes = new Router()

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Gabriel Fernandes',
    email: 'gabrielfernandes@gmail.com',
    password_hash: 'qwerty',
  })

  return res.json(user)
})

export default routes
