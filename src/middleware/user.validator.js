const { check } = require('express-validator');

const userValidation = [
  check('login')
    .exists()
    .notEmpty()
    .isString()
    .custom((value) => !/\s/.test(value))
    .withMessage('No spaces are allowed in the login')
    .isLength({ min: 6, max: 50 })
    .withMessage('Login length must be more than 6 and less than 50')
    .matches(/^[A-Za-z0-9(),-_.,]+$/)
    .withMessage('Login must contain latin only characters'),

  check('password')
    .exists()
    .notEmpty()
    .isString()
    .custom((value) => !/\s/.test(value))
    .withMessage('No spaces are allowed in the password')
    .isLength({ min: 6, max: 50 })
    .withMessage('Password length must be more than 6 and less than 50')
    .matches(/^[A-Za-z(),-_.,]+$/)
    .withMessage('Password must contain latin only characters')
    .custom((value) => /[0-9]/.test(value))
    .withMessage('Password must contain at least 1 number'),

  check('firstname')
    .exists()
    .notEmpty()
    .withMessage('Firstname must be not empty')
    .isString()
    .trim()
    .matches(/^[A-Za-zА-Яа-я]+$/)
    .withMessage('Firstname must contain only latin and cyrilic characters'),

  check('middlename')
    .exists()
    .notEmpty()
    .withMessage('Middlename must be not empty')
    .isString()
    .trim()
    .matches(/^[A-Za-zА-Яа-я]+$/)
    .withMessage('Middlename must contain only latin and cyrilic characters'),

  check('lastname')
    .if(check('lastname').exists().notEmpty())
    .isString()
    .trim()
    .matches(/^[A-Za-zА-Яа-я]+$/)
    .withMessage('Lastname must contain only latin and cyrilic characters'),

  check('role')
    .exists()
    .notEmpty()
    .withMessage('Role must be not empty')
    .isString()
    .isIn(['admin', 'student', 'employee'])
    .withMessage('Incorrect role value'),
    
];

module.exports = {
  userValidation,
};