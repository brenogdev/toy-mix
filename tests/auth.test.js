const request = require('supertest');
const app = require('../src/app');
const knex = require('../src/database/connection');

describe('Autenticação', () => {
  beforeEach(async () => {
    await knex('users').del();
  });

  describe('POST /auth/register', () => {
    it('deve registrar um novo usuário', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: '123456'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
    });

    it('deve retornar erro se usuário já existe', async () => {
      await knex('users').insert({
        username: 'testuser',
        password_hash: 'hash'
      }).returning('id');

      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          password: '123456'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Usuário já existe');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash('123456', 10);
      await knex('users').insert({
        username: 'testuser',
        password_hash: passwordHash
      }).returning('id');
    });

    it('deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: '123456'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('deve retornar erro com senha incorreta', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Senha incorreta');
    });

    it('deve retornar erro com usuário inexistente', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          username: 'nonexistent',
          password: '123456'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Usuário não encontrado');
    });
  });
}); 