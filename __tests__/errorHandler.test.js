const errorHandler = require('../middlewares/errorHandler');
const AppError = require('../middlewares/appError');
const jwt = require('jsonwebtoken');

describe('Error Handler Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    console.error = jest.fn(); // Mock console.error
  });
  
  it('should handle JsonWebTokenError correctly', () => {
    // Setup
    const err = new jwt.JsonWebTokenError('invalid token');
    
    // Call the middleware
    errorHandler(err, req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INVALID TOKEN',
        message: 'Token is invalid! Please Login!'
      }
    });
  });
  
  it('should handle AppError correctly', () => {
    // Setup
    const err = new AppError('Resource not found', 404, 'NOT FOUND');
    
    // Call the middleware
    errorHandler(err, req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'NOT FOUND',
        message: 'Resource not found'
      }
    });
  });
  
  it('should handle generic errors with 500 status code', () => {
    // Setup
    const err = new Error('Something went wrong');
    
    // Call the middleware
    errorHandler(err, req, res, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'INTERNAL SERVER ERROR',
        message: 'Internal Server Error'
      }
    });
    expect(console.error).toHaveBeenCalledWith(err);
  });
});