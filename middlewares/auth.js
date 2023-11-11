const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../utils/config');
const { UNAUTHORIZED } = require('../utils/errors');

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED).send({message: 'Unauthorized'})
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    next();
  } catch(e) {
    res.status(UNAUTHORIZED).send({message: "Unauthorized"});
  }
};

module.exports = authMiddleware;