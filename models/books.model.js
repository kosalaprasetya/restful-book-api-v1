const { ObjectId } = require('mongodb');
const database = require('../config/mongodb.js');

class BooksModel {
  static collection() {
    return database.collection('books');
  }

  static async getAllBooks(page, limit) {
    const res = await this.collection()
      .find({})
      .skip(Number(page) * Number(limit))
      .limit(Number(limit))
      .toArray();
    return res;
  }

  static async postBook(payload) {
    const res = await this.collection().insertOne(payload);
    return res;
  }

  static async deleteBook(id) {
    const res = await this.collection().deleteOne({ _id: new ObjectId(id) });
    return res;
  }

  static async updateBook(id, payload) {
    const res = await this.collection().updateOne(
      { _id: new ObjectId(id) },
      {
        $set: payload,
      }
    );
    return res;
  }
}

module.exports = BooksModel;
