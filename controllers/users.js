const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const IncorrectLoginPasswordError = require('../errors/incorrect-login-password');
const ConflictDataError = require('../errors/conflict-data-error');

const { NODE_ENV, JWT_SECRET } = process.env;
const saltRounds = 10;

module.exports.getUserMe = (req, res, next) => {
  const { _id } = req.user;
  users.findById(_id)
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь по указанному _id не найден.'); }
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const {
    email, password,
  } = req.body;
  return users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res.status(200)
        .cookie('token', token, {
          maxAge: 3600000,
          httpOnly: false,
          sameSite: 'None',
          secure: true,
        })
        .end();
    }).catch(() => {
      throw new IncorrectLoginPasswordError('Неверный логин или пароль');
    }).catch(next);
};

module.exports.logOutUser = (req, res) => {
  res.clearCookie('token', {
    maxAge: 3600000,
    httpOnly: false,
    sameSite: 'None',
    secure: true,
  }).send();
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, saltRounds).then((hash) => users.create({
    name, email, password: hash,
  }))
    .then((user) => {
      users.findById(user._id)
        .then((item) => {
          res.send({ data: item });
        });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictDataError('Пользователь с такой почтой уже зарегистрирован');
      }
      throw err;
    })
    .catch(next);
};

module.exports.patchUser = (req, res, next) => {
  const { name, email } = req.body;
  const owner = req.user._id;
  users.findById(owner).then(() => {
    users.findOneAndUpdate({ _id: owner }, { $set: { name, email } },
      { runValidators: true, new: true })
      .then((item) => { res.send(item); }).catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          throw new ConflictDataError('Пользователь с такой почтой уже зарегистрирован');
        }
        throw err;
      }).catch(next);
  }).catch(next);
};
