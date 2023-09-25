const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'минимальная длина поля name - 2 символа'],
    maxlength: [30, 'максимальная длина поля name - 30 символов'],
    required: [true, 'поле name должно быть заполнено'],
  },
  link: {
    type: String,
    validate: {
      validator: (link) => isURL(link),
      message: 'в поле link необходимо ввести ссылку',
    },
    required: [true, 'поле link должно быть заполнено'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'не получается определить владельца карточки'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
