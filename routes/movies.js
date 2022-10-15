const routerMovies = require('express').Router();

const {
  getMoviesByOwnerID,
  createMovie,
  deleteMovieByID,
} = require('../controllers/movies');

const {
  validateMovie,
  validateMovieID,
} = require('../middlewares/validation');

routerMovies.get('/movies', getMoviesByOwnerID);
routerMovies.post('/movies', validateMovie, createMovie);
routerMovies.delete('/movies/:movieId', validateMovieID, deleteMovieByID);

module.exports = routerMovies;
