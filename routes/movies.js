const routeMovies = require('express').Router();

const { validateNewMovie, validateDeleteMovie } = require('../middlewares/validations');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

routeMovies.get('/', getMovies);
routeMovies.post('/', validateNewMovie, createMovie);
routeMovies.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = routeMovies;
