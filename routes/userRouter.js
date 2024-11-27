const express = require('express')
const userController = require('../controller/userController')
const userRouter = express.Router()


userRouter.get('/api/users/profile', userController.profile)
userRouter.post('/api/users/register',userController.register )
userRouter.post('/api/users/login', userController.login)
userRouter.put('/api/users/change-password', userController.update_password)
userRouter.put('/api/users/change-email', userController.update_email)
userRouter.delete('/api/users/delete-user', userController.delete)

module.exports = userRouter