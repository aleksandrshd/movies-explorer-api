const Movie = require('../models/movie');
const { httpStatusCodes } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    return res.json(movies);
  } catch (err) {
    return next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const newMovie = await Movie.create(
      {
        country: req.body.country,
        director: req.body.director,
        duration: req.body.duration,
        year: req.body.year,
        description: req.body.description,
        image: req.body.image,
        trailerLink: req.body.trailerLink,
        thumbnail: req.body.thumbnail,
        movieId: req.body.movieId,
        nameRU: req.body.nameRU,
        nameEN: req.body.nameEN,
        owner: req.user,
      },
    );
    return res.status(httpStatusCodes.created).json(newMovie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((error) => error.message);
      return next(new BadRequestError(`Переданы некорректные данные при создании карточки. ${errors.join(', ')}`));
    }
    return next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      return next(new NotFoundError('Фильм c указанным id не найден!'));
    }

    if (movie.owner.toHexString() === req.user._id) {
      await Movie.findByIdAndRemove(id);
      return res.json({ message: 'Фильм удалён из избранного' });
    }
    return next(new ForbiddenError('Удаление фильмов, добавленных другими пользователями запрещено!'));
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Передан некорректный id фильма!'));
    }
    return next(err);
  }
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
