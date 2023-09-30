const SECRET_KEY = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret';
const CREATED = 201;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 404;

module.exports = {
  SECRET_KEY,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
};
