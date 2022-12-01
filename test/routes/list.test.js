const request = require('supertest');
const app = require('../../server/app');
const jwt = require('jwt-simple');


const LIST_ROUTE = '/api/lists';
let user;
let user2;

beforeEach(async () => {
  const res = await app.services.user.create({ name: 'Asgard List', mail: `${Date.now()}@gmail.com`, password: 'marvel' });
  user = { ...res[0] };
  user.token = jwt.encode(user, 'Secret');
  const res2 = await app.services.user.create({ name: 'Alfheim List #2', mail: `${Date.now()}@gmail.com`, password: 'marvel' });
  user2 = { ...res2[0] };
});

test('It should only list user accounts', () => {
  return app.db('lists').insert([
    { name: 'Asgardianos #1', user_id: user.id },
    { name: 'Elfos #2', user_id: user2.id },
  ]).then(() => request(app).get(LIST_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Asgardianos #1');
    }));
});

test('You must successfully insert a list', async () => {
  const res = await request(app).post(LIST_ROUTE)
    .send({ name: 'Lis #1' })
    .set('authorization', `bearer ${user.token}`)
  expect(res.status).toBe(201);
  expect(res.body.name).toBe('Lis #1');
});

test('Must not enter an unnamed list', async () => {
  const res = await request(app).post(LIST_ROUTE)
    .send({})
    .set('authorization', `bearer ${user.token}`)
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('List name is a required attribute');
});

test('Must list all lists', () => {
  return app.db('lists')
    .insert({ name: 'Lis list', user_id: user.id })
    .then(() => request(app).get(LIST_ROUTE)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('You must not enter a list with a duplicate name, for the same user', () => {
  return app.db('lists').insert({ name: 'Duplicate list', user_id: user.id })
    .then(() => request(app).post(LIST_ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Duplicate list' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A list with that name already exists!');
    });
});



test('Should return a list by id', () => {
  return app.db('lists')
    .insert({ name: 'List by Id', user_id: user.id }, ['id'])
    .then(lis => request(app).get(`${LIST_ROUTE}/${lis[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('List by Id');
      expect(res.body.user_id).toBe(user.id);
    });
});

test('Must not return another users account', () => {
  return app.db('lists')
    .insert({ name: 'Elfos #2', user_id: user2.id }, ['id'])
    .then(lis => request(app).get(`${LIST_ROUTE}/${lis[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('This resource does not belong to the user');
    });
});

test('Must change a list', () => {
  return app.db('lists')
    .insert({ name: 'List to update', user_id: user.id }, ['id'])
    .then(lis => request(app).put(`${LIST_ROUTE}/${lis[0].id}`)
      .send({ name: 'List Updated' })
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('List Updated');
    });
});

test('Must not change another user s list', () => {
  return app.db('lists')
    .insert({ name: 'Elfos #2', user_id: user2.id }, ['id'])
    .then(lis => request(app).put(`${LIST_ROUTE}/${lis[0].id}`)
      .send({ name: 'List Updated' })
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('This resource does not belong to the user');
    });
});

test('Must remove a list', async () => {
  return app.db('lists')
    .insert({ name: 'List to remove', user_id: user.id }, ['id'])
    .then(lis => request(app).delete(`${LIST_ROUTE}/${lis[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Must not remove another user s account', () => {
  return app.db('lists')
    .insert({ name: 'Elfos #2', user_id: user2.id }, ['id'])
    .then(lis => request(app).delete(`${LIST_ROUTE}/${lis[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('This resource does not belong to the user');
    });
});