const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'минимальная длина поля name - 2 символа'],
    maxlength: [30, 'максимальная длина поля name - 30 символов'],
    required: [true, 'поле name должно быть заполнено'],
  },
  about: {
    type: String,
    minlength: [2, 'минимальная длина about name - 2 символа'],
    maxlength: [30, 'максимальная длина поля about - 30 символов'],
    required: [true, 'поле about должно быть заполнено'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (avatar) => isURL(avatar),
      message: 'в поле avatar необходимо ввести ссылку',
    },
    required: [true, 'поле avatar должно быть заполнено'],
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
