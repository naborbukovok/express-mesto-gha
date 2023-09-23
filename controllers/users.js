const { CastError, ValidationError, DocumentNotFoundError } = require('mongoose').Error;
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Запрос не может быть обработан.' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(404).send({ message: `Пользователь с ID ${req.params.userId} не найден.` });
        return;
      }
      res.status(500).send({ message: 'Запрос не может быть обработан.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ message: 'В метод создания пользователя переданы некоректные данные.' });
        return;
      }
      res.status(500).send({ message: 'Запрос не может быть обработан.' });
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
        res.status(404).send({ message: `Пользователь с ID ${userId} не найден.` });
        return;
      }
      if (err instanceof ValidationError || err instanceof CastError) {
        res.status(400).send({ message: 'В метод обновления профиля пользователя переданы некоректные данные.' });
        return;
      }
      res.status(500).send({ message: 'Запрос не может быть обработан.' });
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
        res.status(404).send({ message: `Пользователь с ID ${userId} не найден.` });
        return;
      }
      if (err instanceof ValidationError || err instanceof CastError) {
        res.status(400).send({ message: 'В метод обновления аватара пользователя переданы некоректные данные.' });
        return;
      }
      res.status(500).send({ message: 'Запрос не может быть обработан.' });
    });
};
