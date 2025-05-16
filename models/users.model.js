const database = require('../config/mongodb.js');

class UserModel {
  static collection() {
    return database.collection('users');
  }
  static async findUserByEmail(email) {
    const res = await this.collection().findOne({ email });
    return res;
  }
  static async createUser(payload) {
    const res = await this.collection().insertOne(payload);
    return res;
  }
}

module.exports = UserModel;
