const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const users = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const IncorrectDataError = require('../errors/incorrect-data-error');
const IncorrectLoginPasswordError = require('../errors/incorrect-login-password');

const { NODE_ENV, JWT_SECRET } = process.env;
const saltRounds = 10;

function validatorFields(email, password) {
  if ((!email) || (!password)) { throw new IncorrectDataError('Не заполнены обязательные поля'); }
  if ((!(typeof (password) === 'string')) || (!(typeof (email) === 'string'))) { throw new IncorrectDataError('В одно из полей переданны некорректные данные'); }
  if (!validator.isEmail(email)) {
    throw new IncorrectDataError('Введеный почтовый адрес некоректен');
  }
}

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
  validatorFields(email, password);
  return users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res.status(200)
        .cookie('token', token, {
          maxAge: 3600000,
          httpOnly: false,
          sameSite: 'None',
          secure: false,
        })
        .end();
    }).catch(() => {
      throw new IncorrectLoginPasswordError('Неверный логин или пароль');
    }).catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!name) { throw new IncorrectDataError('Не заполнены обязательные поля'); }
  validatorFields(email, password);
  bcrypt.hash(password, saltRounds).then((hash) => users.create({
    name, email, password: hash,
  }))
    .then((user) => {
      users.findById(user._id)
        .then((item) => res.send({ data: item }));
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new Error('Пользователь с такой почтой уже зарегистрирован');
        error.statusCode = 409;
        next(error);
      }
    })
    .catch(next);
};

module.exports.patchUser = (req, res, next) => {
  const { name, email } = req.body;
  const owner = req.user._id;
  users.findById(owner).then((user) => {
    if (!user) { throw new NotFoundError('Пользователь по указанному _id не найден.'); }
    if ((!name) || (!email)) { throw new IncorrectDataError('Не заполнены обязательные поля'); }
    if (!validator.isEmail(email)) {
      throw new IncorrectDataError('Введеный почтовый адрес некоректен');
    }
    users.findOneAndUpdate({ _id: owner }, { $set: { name, email } },
      { runValidators: true, new: true },
      (err, item) => {
        if (err) {
          const error = new Error('Ошибка валидации');
          error.statusCode = 400;
          next(error);
        }
        res.send(item);
      });
  }).catch(next);
};
