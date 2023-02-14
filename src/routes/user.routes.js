const express = require('express');
const userController = require('../controllers/user.controller');
const userRouter = express.Router();
const { userValidation } = require('../middleware/user.validator');
const { accessTokenValidation } = require('../middleware/token.validator');

userRouter.get('/users', accessTokenValidation, userController.getUsers);
userRouter.post('/user', userValidation, userController.createUser);

module.exports = userRouter;
