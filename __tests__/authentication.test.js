const request = require('supertest');
const express = require('express');

// Mocks
jest.mock('../models/users.model.js');
jest.mock('../lib/bcrypt.js');
jest.mock('../lib/jwt.js');

const UserModel = require('../models/users.model.js');
const bcrypt = require('../lib/bcrypt.js');
const jwt = require('../lib/jwt.js');

// Import routes and middleware
const defineErrorHandler = require('../middlewares/errorHandler.js');
const authRouter = require('../routes/auth.route.js');

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use(defineErrorHandler);

describe('Authentication Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should return 400 if name is missing', async () => {
      const res = await request(app).post('/auth/register').send({ email: 'test@example.com', password: 'pass123' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error.message', 'Name is required!');
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app).post('/auth/register').send({ name: 'Test', password: 'pass123' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error.message', 'Email is required!');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app).post('/auth/register').send({ name: 'Test', email: 'test@example.com' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error.message', 'Password is required!');
    });

    it('should return 403 if email already taken', async () => {
      UserModel.findUserByEmail.mockResolvedValue({ _id: 'existing', email: 'test@example.com' });
      const res = await request(app).post('/auth/register').send({ name: 'Test', email: 'test@example.com', password: 'pass123' });
      expect(UserModel.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error.message', 'Email has been taken');
    });

    it('should register a new user and return 201', async () => {
      UserModel.findUserByEmail.mockResolvedValue(null);
      bcrypt.hashPassword.mockResolvedValue('hashedPass');
      UserModel.createUser.mockResolvedValue({ insertedId: 'new-id-123' });

      const res = await request(app).post('/auth/register').send({ name: 'Test', email: 'new@example.com', password: 'pass123' });

      expect(bcrypt.hashPassword).toHaveBeenCalledWith('pass123');
      expect(UserModel.createUser).toHaveBeenCalledWith({ name: 'Test', email: 'new@example.com', password: 'hashedPass' });
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ success: 'true', id: 'new-id-123' });
    });
  });

  describe('POST /auth/login', () => {
    it('should return 404 if user not found', async () => {
      UserModel.findUserByEmail.mockResolvedValue(null);

      const res = await request(app).post('/auth/login').send({ email: 'noone@example.com', password: 'pass123' });

      expect(UserModel.findUserByEmail).toHaveBeenCalledWith('noone@example.com');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error.message', 'User Not Found!');
    });

    it('should return 401 if password is invalid', async () => {
      UserModel.findUserByEmail.mockResolvedValue({ _id: 'id1', email: 'user@example.com', password: 'hashed' });
      bcrypt.comparePassword.mockResolvedValue(false);

      const res = await request(app).post('/auth/login').send({ email: 'user@example.com', password: 'wrongpass' });

      expect(bcrypt.comparePassword).toHaveBeenCalledWith('wrongpass', 'hashed');
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error.message', 'Invalid Credentials!');
    });

    it('should login successfully and return 200 with token', async () => {
      UserModel.findUserByEmail.mockResolvedValue({ _id: 'id1', email: 'user@example.com', password: 'hashed' });
      bcrypt.comparePassword.mockResolvedValue(true);
      jwt.signToken.mockReturnValue('jwt-token-123');

      const res = await request(app).post('/auth/login').send({ email: 'user@example.com', password: 'rightpass' });

      expect(jwt.signToken).toHaveBeenCalledWith({ _id: 'id1', email: 'user@example.com' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true, accessToken: 'jwt-token-123' });
    });
  });
});
