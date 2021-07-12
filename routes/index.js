const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const routeUsers = require('./users');
const routeMovies = require('./movies');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);
router.use('/users', auth, routeUsers);
router.use('/movies', auth, routeMovies);

module.exports = router;
