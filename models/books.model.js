const { ObjectId } = require('mongodb');
const database = require('../config/mongodb.js');

class BooksModel {
  static collection() {
    return database.collection('books');
  }

  static async getAllBooks(page, limit) {
    const res = await this.collection()
      .aggregate([
        {
          $lookup: {
            from: 'authors',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $skip: Number(page) * Number(limit),
        },
        {
          $limit: Number(limit),
        },
      ])
      .toArray();
    return res;
  }

  static async getBookById(id) {
    const res = await this.collection()
      .aggregate([
        {
          $match: { _id: new ObjectId(id) },
        },
        {
          $lookup: {
            from: 'authors',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();
    return res[0];
  }

  static async postBook(payload) {
    const res = await this.collection().insertOne(payload);
    return res;
  }

  static async createBook(payload) {
    return this.postBook(payload);
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
