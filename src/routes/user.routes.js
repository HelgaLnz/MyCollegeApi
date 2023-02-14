const express = require('express');
const userController = require('../controllers/user.controller');
const userRouter = express.Router();
const { userValidation } = require('../middleware/user.validator');

userRouter.get('/users', userController.getUsers);
userRouter.post('/user', userValidation, userController.createUser);

module.exports = userRouter;
