const mongoose = require('mongoose');

const URL_REGEXP = /^https?:\/\/[\da-z-]+\.[\da-z-]+\.?[\d\w\-/.]*$/i;

// Поля cхемы для данных карточек фильмов
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (linkToMovieImage) => URL_REGEXP.test(linkToMovieImage),
      // validator: (linkToMovieImage) => validator.isURL(linkToMovieImage),
      message: 'Ошибка в ссылке на картинку фильма',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (linkToMovieImage) => URL_REGEXP.test(linkToMovieImage),
      // validator: (linkToMovieImage) => validator.isURL(linkToMovieImage),
      message: 'Ошибка в ссылке на трейлер фильма',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (linkToMovieImage) => URL_REGEXP.test(linkToMovieImage),
      // validator: (linkToMovieImage) => validator.isURL(linkToMovieImage),
      message: 'Ошибка в ссылке на трейлер фильма',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});
// создание таблицы movie в базе данных moviedb
module.exports = mongoose.model('movie', movieSchema);
