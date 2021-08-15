const routeUsers = require('express').Router();

const {
  patchUser, getUserMe, logOutUser,
} = require('../controllers/users');

const { validatePatchUser } = require('../middlewares/validations');

routeUsers.get('/me', getUserMe);
routeUsers.patch('/me', validatePatchUser, patchUser);
routeUsers.get('/logout', logOutUser);

module.exports = routeUsers;
