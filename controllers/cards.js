const { CastError, ValidationError, DocumentNotFoundError } = require('mongoose').Error;
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Запрос не может быть обработан.' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(400).send({ message: 'В метод создания карточки переданы некоректные данные.' });
        return;
      }
      res.status(500).send({ message: err.name });
    });
};

module.exports.removeCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: `Передан некорректный ID карточки: ${req.params.cardId}.` });
        return;
      }
      if (err instanceof DocumentNotFoundError) {
        res.status(404).send({ message: `Карточка с ID ${req.params.cardId} не найдена.` });
        return;
      }
      res.status(500).send({ message: 'Запрос не может быть обработан.' });
    });
};

module.exports.likeCard = (req, res) => {
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(404).send({ message: `Карточка с ID ${req.params.cardId} не найдена.` });
        return;
      }
      if (err instanceof ValidationError || err instanceof CastError) {
        res.status(400).send({ message: 'В метод постановки лайка на карточку переданы некоректные данные.' });
        return;
      }
      res.status(500).send({ message: 'Запрос не может быть обработан.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(404).send({ message: `Карточка с ID ${req.params.cardId} не найдена.` });
        return;
      }
      if (err instanceof ValidationError || err instanceof CastError) {
        res.status(400).send({ message: 'В метод снятия лайка с карточки переданы некоректные данные.' });
        return;
      }
      res.status(500).send({ message: 'Запрос не может быть обработан.' });
    });
};
