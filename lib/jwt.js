require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

function signToken(payload) {
  const token = jwt.sign(payload, jwtSecret);
  return token;
}

function verifyToken(stringToken) {
  const payload = jwt.verify(stringToken, jwtSecret);
  return payload;
}

module.exports = { signToken, verifyToken };
