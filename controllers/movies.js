const Movie = require('../models/movie');
const ErrorBadRequest = require('../errors/error-bad-request');
const ErrorNotFound = require('../errors/error-not-found');
const ErrorForbidden = require('../errors/error-forbidden');

// # возвращает все сохранённые текущим  пользователем фильмы
// GET /movies
module.exports.getMoviesByOwnerID = (req, res, next) => Movie.find({ owner: req.user._id })
  .then((movies) => res.send(movies.reverse()))
  .catch(next);

// # создаёт фильм с переданными в теле
// # country, director, duration, year, description,
// # image, trailer, nameRU, nameEN и thumbnail, movieId
// POST /movies
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // console.log(err);
        next(new ErrorBadRequest('Переданы некорректные данные при создании карточки фильма.'));
      } else {
        next(err);
      }
    });
};

// # удаляет сохранённый фильм по id
// DELETE /movies/_id
module.exports.deleteMovieByID = (req, res, next) => Movie.findById(req.params.movieId)
  .orFail(() => { throw new ErrorNotFound('Карточка с указанным _id не найдена.'); })
  .then((movie) => {
    if (movie.owner.toString() !== req.user._id) {
      throw new ErrorForbidden('Операция удаления карточки недоступна данному пользователю.');
    } else {
      Movie.findByIdAndDelete(req.params.movieId)
        .then(() => res.send({ movieId: movie._id }))
        .catch(next);
    }
  })
  .catch(next);
