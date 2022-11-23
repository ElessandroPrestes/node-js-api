const request = require('supertest');

const app = require('../server/app');

test('Request must respond in the Root', () => {
  return request(app).get('/')
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

