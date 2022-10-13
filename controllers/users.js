const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ErrorBadRequest = require('../errors/error-bad-request');
const ErrorNotFound = require('../errors/error-not-found');
const ErrorConflict = require('../errors/error-conflict');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;
// console.log(NODE_ENV === 'production');
// console.log(JWT_SECRET);

// # возвращает информацию о пользователе (email и имя)
// GET /users/me
module.exports.getUser = (req, res, next) => User.findById(req.user._id)
  .orFail(() => next(new ErrorNotFound('Пользователь с указанным _id не найдена.')))
  .then((user) => res.send(user))
  .catch(next);

// # создаёт пользователя с переданными в теле
// # email, password и name
// POST /signup
module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ErrorConflict('Пользователь с такими дааными уже зарегистрирован.'));
      } else {
        next(err);
      }
    });
};

// # обновляет информацию о пользователе (email и имя)
// PATCH /users/me
module.exports.updateUserInfoByID = (req, res, next) => User.findByIdAndUpdate(
  req.user._id,
  {
    email: req.body.email,
    name: req.body.name,
  },
  {
    runValidators: true,
    new: true,
  },
)
  .then((user) => {
    if (!user) {
      throw new ErrorNotFound('Пользователь по указанному _id не найден.');
    }
    res.send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new ErrorBadRequest('Переданы некорректные данные при создании пользователя.'));
    } else {
      next(err);
    }
  });

// # проверяет переданные в теле почту и пароль
// # и возвращает JWT
// POST /signin
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .send({ token });
    })
    .catch(next);
};
