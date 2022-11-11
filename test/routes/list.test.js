const request = require('supertest');
const app = require('../../server/app');
const jwt = require('jwt-simple');

const MAIN_ROUTE = '/lists';
let user;

beforeAll(async () => {
  const res = await app.services.user.create({ name: 'Asgard List', mail: `${Date.now()}@gmail.com`, password: 'marvel' });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Secret');
});

test('You must successfully insert a list', async () => {
  const res = await request(app).post('/lists')
    .send({ name: 'Lis #1', user_id: user.id })
    .set('authorization', `bearer ${user.token}`)
  expect(res.status).toBe(201);
  expect(res.body.name).toBe('Lis #1');
});

test('Must not enter an unnamed list', async () => {
  const res = await request(app).post('/lists')
    .send({ user_id: user.id })
    .set('authorization', `bearer ${user.token}`)
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('List name is a required attribute');
});

test('Must list all lists', () => {
  return app.db('lists')
    .insert({ name: 'Lis list', user_id: user.id })
    .then(() => request(app).get('/lists').set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Must list all list by id', () => {
  return app.db('lists')
    .insert({ name: 'List by Id', user_id: user.id }, ['id'])
    .then(lis => request(app).get(`${MAIN_ROUTE}/${lis[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('List by Id');
      expect(res.body.user_id).toBe(user.id);
    });
});

test('Must change a list', () => {
  return app.db('lists')
    .insert({ name: 'List to update', user_id: user.id }, ['id'])
    .then(lis => request(app).put(`${MAIN_ROUTE}/${lis[0].id}`)
      .send({ name: 'List Updated' })
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('List Updated');
    });
});

test('Must remove a list', async () => {
  return app.db('lists')
    .insert({ name: 'List to remove', user_id: user.id }, ['id'])
    .then(lis => request(app).delete(`${MAIN_ROUTE}/${lis[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
