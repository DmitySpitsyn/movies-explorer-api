const routeMovies = require('express').Router();

const { validateNewMovie } = require('../middlewares/validations');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

routeMovies.get('/', getMovies);
routeMovies.post('/', validateNewMovie, createMovie);
routeMovies.delete('/:movieId', deleteMovie);

module.exports = routeMovies;
