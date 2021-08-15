const jwt = require('jsonwebtoken');
const IncorrectLoginPassword = require('../errors/incorrect-login-password');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new IncorrectLoginPassword('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    throw new IncorrectLoginPassword('Необходима авторизация');
  }

  req.user = payload;
  next();
};
