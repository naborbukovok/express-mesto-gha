const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const BadRequestError = require('../errors/bad-request-error');

module.exports.validateURL = (string) => {
  if (!isURL(string)) {
    throw new BadRequestError('it must be valid URL');
  }
  return string;
};

module.exports.validateID = (string) => {
  if (!mongoose.Types.ObjectId.isValid(string)) {
    throw new BadRequestError('it must be valid ID');
  }
  return string;
};
