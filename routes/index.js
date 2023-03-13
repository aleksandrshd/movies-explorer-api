const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { validateSignin, validateSignup } = require('../utils/validation');

router.post('/signin', validateSignin, login);

router.post('/signup', validateSignup, createUser);

router.use(auth);

router.use('/users', usersRouter);

router.use('/movies', moviesRouter);

router.use('*', (req, res, next) => next(new NotFoundError('Запрашиваемый роут не существует')));

module.exports = router;
