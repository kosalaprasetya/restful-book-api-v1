const AppError = require('../middlewares/appError');

describe('AppError', () => {
  it('should create an error with status code and message', () => {
    const message = 'Test error message';
    const statusCode = 404;
    const error = new AppError(message, statusCode);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.status).toBe('fail');
  });

  it('should set status to error for 500 status code', () => {
    const message = 'Server error';
    const statusCode = 500;
    const error = new AppError(message, statusCode);

    expect(error.status).toBe('error');
  });

  it('should set errorCode to default if not provided', () => {
    const error = new AppError('msg', 400);
    expect(error.errorCode).toBe('INTERNAL SERVER ERROR');
  });

  it('should set errorCode if provided', () => {
    const error = new AppError('msg', 400, 'CUSTOM_CODE');
    expect(error.errorCode).toBe('CUSTOM_CODE');
  });

  it('should capture stack trace', () => {
    const error = new AppError('msg', 400);
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });

  it('should inherit from Error', () => {
    const error = new AppError('msg', 400);
    expect(error instanceof Error).toBe(true);
  });

  it('should set status to fail for status codes < 500', () => {
    const error = new AppError('msg', 401);
    expect(error.status).toBe('fail');
  });
});
