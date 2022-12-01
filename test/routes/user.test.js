const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../server/app');

const mail = `${Date.now()}@gmail.com`;

const USERS_ROUTE = '/api/users';
let user;

beforeAll(async () => {
  const mail = `${Date.now()}@gmail.com`;
  const res = await app.services.user.create({ name: 'Heimdall', mail, password: 'marvel' });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Secret');
});


test('Must list all users', () => {
  return request(app).get(USERS_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('You must enter user successfully', () => {
  return request(app).post(USERS_ROUTE)
    .send({ name: 'Thor Odinson', mail, password: '654321' })
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Thor Odinson');
      expect(res.body).not.toHaveProperty('password');
    });
});

test('Must store encrypted password', async () => {
  const res = await request(app).post(USERS_ROUTE)
    .send({ name: 'Loki Odinson', mail: `${Date.now()}@gmail.com`, password: '654321' })
    .set('authorization', `bearer ${user.token}`)
  expect(res.status).toBe(201);
  const { id } = res.body;
  const userDB = await app.services.user.findOne({ id });
  expect(userDB.password).not.toBeUndefined();
  expect(userDB.password).not.toBe('654321');

});

test('Must not enter unnamed user', async () => {
  const res = await request(app).post(USERS_ROUTE)
    .send({ mail: 'thor@gmail.com', password: '654321' })
    .set('authorization', `bearer ${user.token}`)
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('Name is required, check!');

});

test('Must not enter user without email', async () => {
  const result = await request(app).post(USERS_ROUTE)
    .send({ name: 'Thor Odinson', password: '654321' })
    .set('authorization', `bearer ${user.token}`)
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email is required, check!');
});

test('Do not enter user without password', async () => {
  const result = await request(app).post(USERS_ROUTE)
    .send({ name: 'Thor Odinson', mail: 'thor@gmail.com' })
    .set('authorization', `bearer ${user.token}`)
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Password is required, check!');
});


test('You must not enter user with the same email', async () => {
  const res = await request(app).post('/api/users')
    .send({ name: 'Thor Odinson', mail, password: '654321' })
    .set('authorization', `bearer ${user.token}`)
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('E-mail already registered!');
});