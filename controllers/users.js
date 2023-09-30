const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CastError, ValidationError, DocumentNotFoundError } = require('mongoose').Error;
const {
  SECRET_KEY,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constants');
const User = require('../models/user');
const { parseValidationErr } = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Запрос не может быть обработан.' }));
};

module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: `Пользователь с ID ${req.params.userId} не найден.` });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Запрос не может быть обработан.' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(BAD_REQUEST).send({ message: `Передан некорректный ID пользователя: ${req.params.userId}.` });
        return;
      }
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: `Пользователь с ID ${req.params.userId} не найден.` });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Запрос не может быть обработан.' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: `Пользователь с ID ${userId} не найден.` });
        return;
      }
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST).send({ message: `В метод обновления профиля пользователя переданы некоректные данные: ${parseValidationErr(err)}.` });
        return;
      }
      if (err instanceof CastError) {
        res.status(BAD_REQUEST).send({ message: 'В метод обновления профиля пользователя переданы некоректные данные.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Запрос не может быть обработан.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: `Пользователь с ID ${userId} не найден.` });
        return;
      }
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST).send({ message: `В метод обновления аватара пользователя переданы некоректные данные: ${parseValidationErr(err)}.` });
        return;
      }
      if (err instanceof CastError) {
        res.status(BAD_REQUEST).send({ message: 'В метод обновления аватара пользователя переданы некоректные данные.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Запрос не может быть обработан.' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY);
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
      res.send({ token });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED).send({ message: err.message });
    });
};

// Не работает обработка пароля.
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(BAD_REQUEST).send({ message: 'Пользователь с такой почтой уже существует.' });
        return;
      }
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST).send({ message: `В метод создания пользователя переданы некоректные данные: ${parseValidationErr(err)}.` });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Запрос не может быть обработан.' });
    });
};
