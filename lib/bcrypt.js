const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
}

async function comparePassword(password, hash) {
  const result = await bcrypt.compare(password, hash);
  return result;
}

module.exports = { hashPassword, comparePassword };
