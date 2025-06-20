const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('sales').del();
  await knex('clientes').del();
  await knex('users').del();

  // Criar usuário de teste
  const passwordHash = await bcrypt.hash('123456', 10);
  await knex('users').insert([
    { username: 'admin', password_hash: passwordHash }
  ]);

  // Criar clientes de teste
  const clientes = await knex('clientes').insert([
    { nome: 'Ana Beatriz', email: 'ana.b@example.com', nascimento: '1992-05-01' },
    { nome: 'Carlos Eduardo', email: 'cadu@example.com', nascimento: '1987-08-15' },
    { nome: 'Maria Silva', email: 'maria@example.com', nascimento: '1995-03-20' },
    { nome: 'João Santos', email: 'joao@example.com', nascimento: '1989-11-10' }
  ]).returning('*');

  // Criar vendas de teste
  await knex('sales').insert([
    { cliente_id: clientes[0].id, data: '2024-01-01', valor: 150.00 },
    { cliente_id: clientes[0].id, data: '2024-01-02', valor: 50.00 },
    { cliente_id: clientes[1].id, data: '2024-01-01', valor: 200.00 },
    { cliente_id: clientes[1].id, data: '2024-01-03', valor: 75.00 },
    { cliente_id: clientes[1].id, data: '2024-01-05', valor: 120.00 },
    { cliente_id: clientes[2].id, data: '2024-01-02', valor: 300.00 },
    { cliente_id: clientes[2].id, data: '2024-01-04', valor: 80.00 },
    { cliente_id: clientes[3].id, data: '2024-01-01', valor: 90.00 },
    { cliente_id: clientes[3].id, data: '2024-01-06', valor: 250.00 }
  ]);
};
