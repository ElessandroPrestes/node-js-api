const request = require('supertest');

const app = require('../server/app');

test('Requisição deve responder na Raiz', () => {
  return request(app).get('/')
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

