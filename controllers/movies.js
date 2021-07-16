const movies = require('../models/movie');
const IncorrectDataError = require('../errors/incorrect-data-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenDataError = require('../errors/forbidden-data-error');

module.exports.getMovies = (req, res, next) => {
  movies.find({})
    .then((items) => res.send(items))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer,
    nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  movies.create({
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
    .catch(() => {
      throw new IncorrectDataError('Переданы некорректные данные.');
    }).catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  return movies.findOne({ _id: movieId }).then((movie) => {
    if (movie) {
      if (movie.owner.toString() === req.user._id) {
        return movie.remove().then(() => { res.status(200).send(movie); });
      }
      throw new ForbiddenDataError('Нельзя удалить чужую карточку');
    }
    throw new NotFoundError('Карточка по указанному _id не найдена.');
  }).catch(next);
};
