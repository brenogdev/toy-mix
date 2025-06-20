const request = require('supertest');
const app = require('../src/app');
const knex = require('../src/database/connection');
const jwt = require('jsonwebtoken');

let authToken;

beforeAll(async () => {
  // Criar usuário de teste e gerar token
  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash('123456', 10);
  const [userId] = await knex('users').insert({
    username: 'testuser',
    password_hash: passwordHash
  });

  authToken = jwt.sign({ id: userId, username: 'testuser' }, process.env.JWT_SECRET || 'supersecretjwt');
});

describe('Clientes', () => {
  beforeEach(async () => {
    await knex('sales').del();
    await knex('clientes').del();
  });

  describe('GET /clientes', () => {
    beforeEach(async () => {
      await knex('clientes').insert([
        { nome: 'Ana Beatriz', email: 'ana@example.com', nascimento: '1992-05-01' },
        { nome: 'Carlos Eduardo', email: 'carlos@example.com', nascimento: '1987-08-15' }
      ]);
    });

    it('deve listar todos os clientes', async () => {
      const response = await request(app)
        .get('/clientes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.clientes).toHaveLength(2);
      expect(response.body.meta.registroTotal).toBe(2);
    });

    it('deve filtrar clientes por nome', async () => {
      const response = await request(app)
        .get('/clientes?nome=Ana')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.clientes).toHaveLength(1);
      expect(response.body.data.clientes[0].info.nomeCompleto).toBe('Ana Beatriz');
    });

    it('deve retornar erro sem token de autenticação', async () => {
      const response = await request(app)
        .get('/clientes');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /clientes', () => {
    it('deve cadastrar um novo cliente', async () => {
      const response = await request(app)
        .post('/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'João Silva',
          email: 'joao@example.com',
          nascimento: '1990-01-01'
        });

      expect(response.status).toBe(201);
      expect(response.body.nome).toBe('João Silva');
      expect(response.body.email).toBe('joao@example.com');
    });

    it('deve retornar erro se campos obrigatórios estiverem faltando', async () => {
      const response = await request(app)
        .post('/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'João Silva'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Nome, email e nascimento são obrigatórios');
    });
  });

  describe('PUT /clientes/:id', () => {
    let clienteId;

    beforeEach(async () => {
      const [id] = await knex('clientes').insert({
        nome: 'Maria Silva',
        email: 'maria@example.com',
        nascimento: '1995-03-20'
      });
      clienteId = id;
    });

    it('deve editar um cliente existente', async () => {
      const response = await request(app)
        .put(`/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Maria Santos'
        });

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe('Maria Santos');
    });

    it('deve retornar erro se cliente não existir', async () => {
      const response = await request(app)
        .put('/clientes/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Nome Atualizado'
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Cliente não encontrado');
    });
  });

  describe('DELETE /clientes/:id', () => {
    let clienteId;

    beforeEach(async () => {
      const [id] = await knex('clientes').insert({
        nome: 'Pedro Santos',
        email: 'pedro@example.com',
        nascimento: '1988-12-25'
      });
      clienteId = id;
    });

    it('deve deletar um cliente existente', async () => {
      const response = await request(app)
        .delete(`/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);
    });

    it('deve retornar erro se cliente não existir', async () => {
      const response = await request(app)
        .delete('/clientes/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Cliente não encontrado');
    });
  });
}); 