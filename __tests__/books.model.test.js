const BooksModel = require('../models/books.model');
const database = require('../config/mongodb');
const { ObjectId } = require('mongodb');

jest.mock('../config/mongodb');

describe('BooksModel', () => {
  let mockCollection;
  let mockAggregate;
  let mockInsertOne;
  let mockDeleteOne;
  let mockUpdateOne;

  beforeEach(() => {
    mockAggregate = jest.fn();
    mockInsertOne = jest.fn();
    mockDeleteOne = jest.fn();
    mockUpdateOne = jest.fn();

    mockCollection = {
      aggregate: mockAggregate,
      insertOne: mockInsertOne,
      deleteOne: mockDeleteOne,
      updateOne: mockUpdateOne,
    };

    database.collection = jest.fn().mockReturnValue(mockCollection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllBooks', () => {
    it('should aggregate and return all books with pagination', async () => {
      const fakeBooks = [{ _id: new ObjectId(), title: 'Book1', author: {} }];
      mockAggregate.mockReturnValue({ toArray: jest.fn().mockResolvedValue(fakeBooks) });

      const result = await BooksModel.getAllBooks(1, 10);

      expect(database.collection).toHaveBeenCalledWith('books');
      expect(mockAggregate).toHaveBeenCalledWith([
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
          $skip: 10,
        },
        {
          $limit: 10,
        },
      ]);
      expect(result).toBe(fakeBooks);
    });
  });

  describe('getBookById', () => {
    it('should aggregate and return a book by id', async () => {
      const fakeBook = { _id: new ObjectId(), title: 'Book2', author: {} };
      mockAggregate.mockReturnValue({ toArray: jest.fn().mockResolvedValue([fakeBook]) });

      const result = await BooksModel.getBookById(fakeBook._id.toString());

      expect(mockAggregate).toHaveBeenCalledWith([
        { $match: { _id: new ObjectId(fakeBook._id.toString()) } },
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
      ]);
      expect(result).toBe(fakeBook);
    });

    it('should return undefined if book not found', async () => {
      mockAggregate.mockReturnValue({ toArray: jest.fn().mockResolvedValue([]) });

      const result = await BooksModel.getBookById(new ObjectId().toString());

      expect(result).toBeUndefined();
    });
  });

  describe('postBook', () => {
    it('should insert a book and return the result', async () => {
      const payload = { title: 'New Book' };
      const fakeResult = { insertedId: new ObjectId() };
      mockInsertOne.mockResolvedValue(fakeResult);

      const result = await BooksModel.postBook(payload);

      expect(mockInsertOne).toHaveBeenCalledWith(payload);
      expect(result).toBe(fakeResult);
    });
  });

  describe('createBook', () => {
    it('should call postBook and return its result', async () => {
      const payload = { title: 'Another Book' };
      const fakeResult = { insertedId: new ObjectId() };
      BooksModel.postBook = jest.fn().mockResolvedValue(fakeResult);

      const result = await BooksModel.createBook(payload);

      expect(BooksModel.postBook).toHaveBeenCalledWith(payload);
      expect(result).toBe(fakeResult);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book by id and return the result', async () => {
      const id = new ObjectId().toString();
      const fakeResult = { deletedCount: 1 };
      mockDeleteOne.mockResolvedValue(fakeResult);

      const result = await BooksModel.deleteBook(id);

      expect(mockDeleteOne).toHaveBeenCalledWith({ _id: new ObjectId(id) });
      expect(result).toBe(fakeResult);
    });
  });

  describe('updateBook', () => {
    it('should update a book by id and return the result', async () => {
      const id = new ObjectId().toString();
      const payload = { title: 'Updated Title' };
      const fakeResult = { modifiedCount: 1 };
      mockUpdateOne.mockResolvedValue(fakeResult);

      const result = await BooksModel.updateBook(id, payload);

      expect(mockUpdateOne).toHaveBeenCalledWith({ _id: new ObjectId(id) }, { $set: payload });
      expect(result).toBe(fakeResult);
    });
  });
});
