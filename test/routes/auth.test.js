const request = require('supertest');
const app = require('../../server/app');

test('Must create user via signup', () => {
  const mail = `${Date.now()}@gmail.com`;
  return request(app).post('/auth/signup')
    .send({ name: 'Valkyrie', mail, password: '654321' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Valkyrie');
      expect(res.body).toHaveProperty('mail');
      expect(res.body).not.toHaveProperty('password');
    })
});

test('Must receive token when logging in', () => {
  const mail = `${Date.now()}@gmail.com`;
  return app.services.user.create(
    { name: 'Freyja Odinson', mail, password: '654321' }
  )
    .then(() => request(app).post('/auth/signin')
      .send({ mail, password: '654321' })
    )
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test('Must not authenticate user with wrong password', () => {
  const mail = `${Date.now()}@gmail.com`;
  return app.services.user.create(
    { name: 'Freyja Odinson', mail, password: '654321' }
  )
    .then(() => request(app).post('/auth/signin')
      .send({ mail, password: '654322' })
    )
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid username or password');
    });
});

test('Should not authorize user that does not exist', () => {
  return request(app).post('/auth/signin')
    .send({ mail: 'kratos@gmail.com', password: '654322' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid username or password');
    });
});

test('Must not access a protected route without a token', () => {
  return request(app).get('/api/users')
    .then((res) => {
      expect(res.status).toBe(401);
    });
});
