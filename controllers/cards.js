const { CREATED } = require('../utils/constants');
const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

// Получение всех карточек.
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

// Создание новой карточки.
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const currentUserId = req.user._id;

  Card.create({ name, link, owner: currentUserId })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch(next);
};

// Удаление карточки.
module.exports.removeCard = (req, res, next) => {
  const { cardId } = req.params;
  const currentUserId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с ID ${cardId} не найдена.`);
      }

      if (!card.owner.equals(currentUserId)) {
        throw new ForbiddenError(`Карточка с ID ${cardId} принадлежит другому пользователю.`);
      }

      Card.deleteOne(card)
        .then(res.send({ data: card }))
        .catch(next);
    })
    .catch(next);
};

// Постановка лайка на карточку.
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const currentUserId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: currentUserId } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с ID ${cardId} не найдена.`);
      }
      res.send({ data: card });
    })
    .catch(next);
};

// Снятие лайка с карточки.
module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const currentUserId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: currentUserId } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с ID ${cardId} не найдена.`);
      }
      res.send({ data: card });
    })
    .catch(next);
};
