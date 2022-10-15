const routerUsers = require('express').Router();

const {
  getUser,
  updateUserInfoByID,
} = require('../controllers/users');

const {
  validateUserInfo,
} = require('../middlewares/validation');

routerUsers.get('/users/me', getUser);
routerUsers.patch('/users/me', validateUserInfo, updateUserInfoByID);

module.exports = routerUsers;
