const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

module.exports.validateNewMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer().required(),
    year: Joi.string().required().custom((value, helpers) => {
      if (validator.isNumeric(value)) {
        return value;
      }
      return helpers.message('Значение {#label} может состоять только из цифр!');
    }),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('В {#label} введена некоректная ссылка!');
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('В {#label} введена некоректная ссылка!');
    }),
    nameRU: Joi.string().required().regex(/^[А-Яа-я0-9Ёё"«», ]+$/).message('Значение {#label} может состоять только из русских букв!'),
    nameEN: Joi.string().required().regex(/^[A-Za-z0-9"«», ]+$/).message('Значение {#label} может состоять только из латинских букв!'),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('В {#label} введена некоректная ссылка!');
    }),
    movieId: Joi.number().integer().required(),

  }).messages({
    'string.empty': '{#label} Поле не может быть пустым',
    'any.required': '{#label} Не заполнено обязательное поле',
    'number.base': '{#label} Поле не может быть пустым и должно состоять только из цифр',
  }),
});

module.exports.validatePatchUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Введенный адрес некоректен!');
    }),
  }).messages({
    'string.empty': '{#label} Поле не может быть пустым',
    'any.required': '{#label} Не заполнено обязательное поле',
  }),
});

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Введенный адрес некоректен!');
    }),
    password: Joi.string().required(),
  }).messages({
    'string.empty': '{#label} Поле не может быть пустым',
    'any.required': '{#label} Не заполнено обязательное поле',
  }),
});

module.exports.validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Введенный адрес некоректен!');
    }),
    password: Joi.string().required(),
  }).messages({
    'string.empty': '{#label} Поле не может быть пустым',
    'any.required': '{#label} Не заполнено обязательное поле',
  }),
});

module.exports.validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).message('{#label} Введен некорректный id'),
  }).messages({
    'string.hex': '{#label} Передан некорректный id',
  }),
});
