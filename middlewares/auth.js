const jwt = require('jsonwebtoken');
const { SECRET_KEY, UNAUTHORIZED } = require('../utils/constants');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация.' });
  }

  let payload;

  try {
    payload = jwt.verify(req.cookies.jwt, SECRET_KEY);
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация.' });
  }

  req.user = payload;

  next();
};
