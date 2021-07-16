const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const routeUsers = require('./users');
const routeMovies = require('./movies');
const auth = require('../middlewares/auth');

const { validateCreateUser, validateLoginUser } = require('../middlewares/validations');

router.post('/signin', validateLoginUser, login);
router.post('/signup', validateCreateUser, createUser);
router.use('/', auth);
router.use('/users', routeUsers);
router.use('/movies', routeMovies);

module.exports = router;
