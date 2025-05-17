jest.mock('../models/books.model', () => ({
  getAllBooks: jest.fn(),
  getBookById: jest.fn(),
  postBook: jest.fn(),
  deleteBook: jest.fn(),
  updateBook: jest.fn(),
}));

const Books = require('../controllers/books.controller');
const AppError = require('../middlewares/appError.js');
const BooksModel = require('../models/books.model');

describe('Books Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {}, params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAllBooks', () => {
    it('should return books with status 200', async () => {
      BooksModel.getAllBooks.mockResolvedValue([{ title: 'Book1' }]);
      req.query = { page: 1, limit: 2 };
      await Books.getAllBooks(req, res, next);
      expect(BooksModel.getAllBooks).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        page: 2,
        limit: 2,
        data: [{ title: 'Book1' }],
      });
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      BooksModel.getAllBooks.mockRejectedValue(error);
      await Books.getAllBooks(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getBookById', () => {
    it('should return book with status 200', async () => {
      BooksModel.getBookById.mockResolvedValue({ title: 'Book1' });
      req.params = { id: '123' };
      await Books.getBookById(req, res, next);
      expect(BooksModel.getBookById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { title: 'Book1' },
      });
    });

    it('should throw AppError if book not found', async () => {
      BooksModel.getBookById.mockResolvedValue(null);
      req.params = { id: '123' };
      await Books.getBookById(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      BooksModel.getBookById.mockRejectedValue(error);
      req.params = { id: '123' };
      await Books.getBookById(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('addBook', () => {
    it('should add book and return 201', async () => {
      BooksModel.postBook.mockResolvedValue({ insertedId: 'abc' });
      req.body = {
        title: 'Book1',
        authorId: '507f1f77bcf86cd799439011',
        description: 'desc',
        pages: 100,
        ISBN: '123456',
        publishedYear: '2020-01-01',
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01',
      };
      await Books.addBook(req, res, next);
      expect(BooksModel.postBook).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ success: true, id: 'abc' });
    });

    it('should call next on error', async () => {
      BooksModel.postBook.mockRejectedValue(new Error('fail'));
      await Books.addBook(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('createBook', () => {
    it('should call addBook', async () => {
      const spy = jest.spyOn(Books, 'addBook').mockResolvedValue();
      await Books.createBook(req, res, next);
      expect(spy).toHaveBeenCalledWith(req, res, next);
      spy.mockRestore();
    });
  });

  describe('deleteBook', () => {
    it('should delete book and return 204', async () => {
      BooksModel.deleteBook.mockResolvedValue({ deletedCount: 1 });
      req.params = { id: '123' };
      await Books.deleteBook(req, res, next);
      expect(BooksModel.deleteBook).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ ok: true });
    });

    it('should call next on error', async () => {
      BooksModel.deleteBook.mockRejectedValue(new Error('fail'));
      req.params = { id: '123' };
      await Books.deleteBook(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('updateBook', () => {
    it('should update book and return 204', async () => {
      BooksModel.getBookById.mockResolvedValue({ _id: '123' });
      BooksModel.updateBook.mockResolvedValue({ modifiedCount: 1 });
      req.params = { id: '123' };
      req.body = {
        title: 'Book1',
        authorId: '507f1f77bcf86cd799439011',
        description: 'desc',
        pages: 100,
        ISBN: '123456',
        publishedYear: '2020-01-01',
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01',
      };
      await Books.updateBook(req, res, next);
      expect(BooksModel.getBookById).toHaveBeenCalledWith('123');
      expect(BooksModel.updateBook).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ ok: true });
    });

    it('should throw AppError if book not found', async () => {
      BooksModel.getBookById.mockResolvedValue(null);
      req.params = { id: '123' };
      await Books.updateBook(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should call next on error', async () => {
      BooksModel.getBookById.mockRejectedValue(new Error('fail'));
      req.params = { id: '123' };
      await Books.updateBook(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
