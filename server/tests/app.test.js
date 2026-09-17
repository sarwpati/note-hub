import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';

let mongoServer;
let agent1;
let agent2;
let user1Token;
let user2Token;
let noteId;

test.before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.CLIENT_URL = 'http://localhost:5173';

  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();

  await mongoose.connect(process.env.MONGODB_URI);
});

test.after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test('registers a user', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Alice Smith',
      email: 'alice@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    })
    .expect(200);

  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.email, 'alice@example.com');
  assert.ok(response.headers['set-cookie'][0].includes('token='));
});

test('logs in a user and fetches current profile', async () => {
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'alice@example.com',
      password: 'Password123',
    })
    .expect(200);

  user1Token = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
  assert.ok(user1Token);

  const profileResponse = await request(app)
    .get('/api/auth/me')
    .set('Cookie', [`token=${user1Token}`])
    .expect(200);

  assert.equal(profileResponse.body.success, true);
  assert.equal(profileResponse.body.data.user.email, 'alice@example.com');
});

test('creates, fetches, updates and archives a note', async () => {
  const createResponse = await request(app)
    .post('/api/notes')
    .set('Cookie', [`token=${user1Token}`])
    .send({
      title: 'React learning',
      content: 'Today I learned about hooks and state.',
      tags: ['react', 'javascript'],
      color: 'blue',
    })
    .expect(201);

  assert.equal(createResponse.body.success, true);
  assert.equal(createResponse.body.data.note.title, 'React learning');
  noteId = createResponse.body.data.note._id;

  const listResponse = await request(app)
    .get('/api/notes?page=1&limit=12&search=react')
    .set('Cookie', [`token=${user1Token}`])
    .expect(200);

  assert.equal(listResponse.body.success, true);
  assert.equal(listResponse.body.data.pagination.total, 1);
  assert.equal(listResponse.body.data.notes[0].title, 'React learning');

  const updateResponse = await request(app)
    .put(`/api/notes/${noteId}`)
    .set('Cookie', [`token=${user1Token}`])
    .send({
      title: 'Updated React learning',
      content: 'I learned about hooks and component lifecycle.',
      tags: ['react', 'frontend'],
    })
    .expect(200);

  assert.equal(updateResponse.body.data.note.title, 'Updated React learning');

  const archiveResponse = await request(app)
    .patch(`/api/notes/${noteId}/archive`)
    .set('Cookie', [`token=${user1Token}`])
    .expect(200);

  assert.equal(archiveResponse.body.data.note.isArchived, true);
});

test('prevents cross-user access to notes', async () => {
  const secondUserResponse = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Bob Jones',
      email: 'bob@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    })
    .expect(200);

  user2Token = secondUserResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];

  const forbidden = await request(app)
    .get(`/api/notes/${noteId}`)
    .set('Cookie', [`token=${user2Token}`])
    .expect(404);

  assert.equal(forbidden.body.success, false);
  assert.equal(forbidden.body.message, 'Note not found');
});

test('logs out a user', async () => {
  const response = await request(app)
    .post('/api/auth/logout')
    .set('Cookie', [`token=${user1Token}`])
    .expect(200);

  assert.equal(response.body.success, true);
  assert.equal(response.body.message, 'Logged out successfully');
});
