const routeUsers = require('express').Router();

const {
  patchUser, getUserMe,
} = require('../controllers/users');

routeUsers.get('/me', getUserMe);
routeUsers.patch('/me', patchUser);

module.exports = routeUsers;
