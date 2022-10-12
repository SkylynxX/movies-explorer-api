const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const ErrorNotAuthorized = require('../errors/error-not-authorized');

const URL_REGEXP = /^https?:\/\/[\da-z-]+\.[\da-z-]+\.?[\d\w\-/.]*$/i;
// Поля схемы пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Пользователь кинотеки',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Ошибка в email пользователя',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorNotAuthorized('Ошибка в паре email и/или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new ErrorNotAuthorized('Ошибка в паре email и/или пароль');
          }
          return user;
        });
    });
};
// Создание модели-таблицы users в базе данных moviedb
module.exports = mongoose.model('user', userSchema);
