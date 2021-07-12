const { Joi, celebrate } = require('celebrate');

module.exports.validateNewMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required().regex(/^[0-9]+$/).message('Значение {#label} может состоять только из цифр!'),
    year: Joi.string().required().regex(/^[0-9]+$/).message('Значение {#label} может состоять только из цифр!'),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/).message('В {#label} введена некоректная ссылка!'),
    trailer: Joi.string().required().regex(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/).message('В {#label} введена некоректная ссылка!'),
    nameRU: Joi.string().required().regex(/^[А-Яа-я0-9Ёё ]+$/).message('Значение {#label} может состоять только из русских букв!'),
    nameEN: Joi.string().required().regex(/^[A-Za-z0-9 ]+$/).message('Значение {#label} может состоять только из латинских букв!'),
    thumbnail: Joi.string().required().regex(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/).message('В {#label} введена некоректная ссылка!'),
    movieId: Joi.string().required().regex(/^[0-9]+$/).message('Значение {#label} может состоять только из цифр!'),
  }).messages({
    'string.empty': '{#label} Поле не может быть пустым',
    'any.required': '{#label} Не заполнено обязательное поле',
  }),
});
