const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET_KEY, CREATED } = require('../utils/constants');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');

// Получение списка пользователей.
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

// Получение текущего пользователя.
module.exports.getCurrentUser = (req, res, next) => {
  const currentUserId = req.user._id;

  User.findById(currentUserId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с ID ${currentUserId} не найден.`);
      }

      res.send({ data: user });
    })
    .catch(next);
};

// Получение пользователя по ID.
module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с ID ${userId} не найден.`);
      }

      res.send({ data: user });
    })
    .catch(next);
};

// Обновление информации о пользователе.
module.exports.updateUserInfo = (req, res, next) => {
  const currentUserId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(currentUserId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с ID ${currentUserId} не найден.`);
      }

      res.send({ data: user });
    })
    .catch(next);
};

// Обновление аватара пользователя.
module.exports.updateUserAvatar = (req, res, next) => {
  const currentUserId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(currentUserId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с ID ${currentUserId} не найден.`);
      }

      res.send({ data: user });
    })
    .catch(next);
};

// Вход.
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY);
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
      res.send({ token });
    })
    .catch(next);
};

// Создание нового пользователя.
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED).send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже существует.'));
      } else {
        next(err);
      }
    });
};
