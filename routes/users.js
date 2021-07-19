const routeUsers = require('express').Router();

const {
  patchUser, getUserMe,
} = require('../controllers/users');

const { validatePatchUser } = require('../middlewares/validations');

routeUsers.get('/me', getUserMe);
routeUsers.patch('/me', validatePatchUser, patchUser);

module.exports = routeUsers;
