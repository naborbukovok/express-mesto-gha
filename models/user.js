const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isURL = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'минимальная длина поля name - 2 символа'],
    maxlength: [30, 'максимальная длина поля name - 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'минимальная длина поля about - 2 символа'],
    maxlength: [30, 'максимальная длина поля about - 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (avatar) => isURL(avatar),
      message: 'в поле avatar необходимо ввести ссылку',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    validate: {
      validator: (email) => isEmail(email),
      message: 'в поле email необходимо ввести электронную почту',
    },
    unique: true,
    required: [true, 'поле email должно быть заполнено'],
  },
  password: {
    type: String,
    minlength: [8, 'минимальная длина поля password - 8 символов'],
    required: [true, 'поле password должно быть заполнено'],
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // return Promise.reject(new UnauthorizedError('Неправильные почта или пароль.'));
        throw new UnauthorizedError('Неправильные почта или пароль.');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // return Promise.reject(new UnauthorizedError('Неправильные почта или пароль.'));
            throw new UnauthorizedError('Неправильные почта или пароль.');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
