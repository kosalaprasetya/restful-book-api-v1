const { ObjectId } = require('mongodb');
const BooksModel = require('../models/books.model');
const AppError = require('../middlewares/appError.js');

class Books {
  static async getAllBooks(req, res, next) {
    try {
      const page = req.query.page || 0;
      const limit = req.query.limit || 4;
      const books = await BooksModel.getAllBooks(page, limit);
      return res.status(200).json({ success: true, page: Number(page) + 1, limit, data: books });
    } catch (error) {
      next(error);
    }
  }

  static async getBookById(req, res, next) {
    try {
      const { id } = req.params;
      const book = await BooksModel.getBookById(id);
      if (!book) throw new AppError('Book Not Found!', 404, 'NOT FOUND');
      return res.status(200).json({ success: true, data: book });
    } catch (error) {
      next(error);
    }
  }

  static async addBook(req, res, next) {
    try {
      const data = req.body;
      const newBook = {
        title: data.title,
        authorId: new ObjectId(data.authorId),
        description: data.description,
        pages: data.pages,
        ISBN: data.ISBN,
        publishedYear: new Date(data.publishedYear),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
      const result = await BooksModel.postBook(newBook);
      return res.status(201).json({ success: true, id: result.insertedId });
    } catch (error) {
      next(error);
    }
  }

  static async createBook(req, res, next) {
    return this.addBook(req, res, next);
  }

  static async deleteBook(req, res, next) {
    try {
      const { id } = req.params;
      const result = await BooksModel.deleteBook(id);
      console.log(`Success delete book with id ${id} \n`, result);
      return res.status(204).json({ ok: true });
    } catch (error) {
      next(error);
    }
  }

  static async updateBook(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;

      const foundBook = await BooksModel.getBookById(id);
      if (!foundBook) throw new AppError('Book Not Found!', 404, 'NOT FOUND');

      const updatedBook = {
        title: data.title,
        authorId: new ObjectId(data.authorId),
        description: data.description,
        pages: data.pages,
        ISBN: data.ISBN,
        publishedYear: new Date(data.publishedYear),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(),
      };

      const result = await BooksModel.updateBook(id, updatedBook);
      console.log(`Success update book with id ${id} \n`, result);
      return res.status(204).json({ ok: true });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Books;
