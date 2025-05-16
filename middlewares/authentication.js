const jwt = require('../lib/jwt.js');
const AppError = require('./appError');

const authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer') throw new AppError('Invalid Token!', 401, 'UNAUTHORIZED');
    if (!type || !token) throw new AppError('Invalid Token!', 401, 'UNAUTHORIZED');

    const verifiedToken = jwt.verifyToken(token);
    if (!verifiedToken) throw new AppError('Invalid Token!', 401, 'UNAUTHORIZED');
    req.headers.userData = verifiedToken;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = authentication;
