const routerIndex = require('express').Router();
const routerUsers = require('./users');
const routerCards = require('./movies');
const auth = require('../middlewares/auth');
const ErrorNotFound = require('../errors/error-not-found');

const {
  login,
  createUser,
} = require('../controllers/users');

const {
  validateUser,
  validateLogin,
} = require('../middlewares/validation');

routerIndex.post('/signin', validateLogin, login);
routerIndex.post('/signup', validateUser, createUser);
routerIndex.use(auth);
routerIndex.use(routerUsers);
routerIndex.use(routerCards);
routerIndex.use('*', (req, res, next) => next(new ErrorNotFound()));

module.exports = routerIndex;
