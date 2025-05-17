const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());
app.get('/api/books', (req, res) => res.json([{ id: 1, title: 'Test Book' }]));
app.post('/api/books', (req, res) => res.status(201).json({ id: 2, ...req.body }));

// Mock auth routes (simulate routes/auth.js)
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  return res.status(201).json({ id: 1, username });
});
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'testuser' && password === 'testpass') {
    return res.json({ token: 'fake-jwt-token' });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

describe('Book Routes', () => {
  it('GET /api/books should return list of books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('title');
  });

  it('POST /api/books should create a new book', async () => {
    const newBook = { title: 'New Book', author: 'Author' };
    const res = await request(app).post('/api/books').send(newBook);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject(newBook);
    expect(res.body).toHaveProperty('id');
  });
});

describe('Auth Routes', () => {
  it('POST /api/auth/register should register a new user', async () => {
    const user = { username: 'testuser', password: 'testpass' };
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', user.username);
  });

  it('POST /api/auth/register should fail with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ username: 'testuser' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/auth/login should login with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'testuser', password: 'testpass' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/auth/login should fail with wrong credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'wrong', password: 'wrong' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
