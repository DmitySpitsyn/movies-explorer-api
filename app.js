require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

mongoose.set('useUnifiedTopology', true);
const express = require('express');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors({ origin: 'https://mesto-dvspicin.nomoredomains.monster', credentials: true }));
app.use(cookieParser());
const bodyParser = require('body-parser');
const NotFoundError = require('./errors/not-found-error');
const router = require('./routes/index');
const IncorrectDataError = require('./errors/incorrect-data-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);
app.use(() => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errors());

app.use((err, req, res, next) => {
  if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
    throw new IncorrectDataError('Переданы некорректные данные');
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next(err);
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
