const express = require('express');
const knex = require('../database/connection');

const router = express.Router();

// Listar clientes com filtros e paginação
router.get('/', async (req, res) => {
  try {
    const { nome, email, id } = req.query;
    const pagina = parseInt(req.query.pagina) || 1;
    const porPagina = parseInt(req.query.porPagina) || 5;

    let query = knex('clientes');
    if (id) {
      query = query.where('id', id);
    }
    if (nome) {
      query = query.where('nome', 'ilike', `%${nome}%`);
    }
    if (email) {
      query = query.where('email', 'ilike', `%${email}%`);
    }

    let clientes;
    let total;
    if (id) {
      clientes = await query.select('*');
      total = clientes.length;
    } else {
      const registroTotal = await query.clone().count('* as total').first();
      total = registroTotal ? Number(registroTotal.total) : 0;
      clientes = await query
        .orderBy('id', 'desc')
        .limit(porPagina)
        .offset((pagina - 1) * porPagina)
        .select('*');
    }

    const formattedResponse = {
      data: {
        clientes: clientes.map(cliente => ({
          id: cliente.id,
          info: {
            nomeCompleto: cliente.nome,
            detalhes: {
              email: cliente.email,
              nascimento: cliente.nascimento
            }
          },
          estatisticas: {
            vendas: []
          }
        }))
      },
      meta: {
        registroTotal: total,
        pagina
      },
      redundante: {
        status: "ok"
      }
    };

    res.json(formattedResponse);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Cadastrar cliente
router.post('/', async (req, res) => {
  try {
    const { nome, email, nascimento } = req.body;

    if (!nome || !email || !nascimento) {
      return res.status(400).json({ error: 'Nome, email e nascimento são obrigatórios' });
    }

    const [clienteId] = await knex('clientes')
      .insert({
        nome,
        email,
        nascimento
      })
      .returning('id');

    // Compatível com diferentes bancos (id pode ser número ou objeto)
    let id = clienteId;
    if (typeof clienteId === 'object' && clienteId !== null && 'id' in clienteId) {
      id = clienteId.id;
    }

    const cliente = await knex('clientes').where({ id }).first();
    res.status(201).json(cliente);
  } catch (error) {
    // Tenta capturar o código do erro em diferentes níveis
    const errorCode = error.code || (error.original && error.original.code);
    if (errorCode === '23505') { // Unique constraint violation
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    console.error('Erro ao cadastrar cliente:', error); // Log detalhado para debug
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Editar cliente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, nascimento } = req.body;

    const cliente = await knex('clientes').where({ id }).first();
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    await knex('clientes').where({ id }).update({
      nome: nome || cliente.nome,
      email: email || cliente.email,
      nascimento: nascimento || cliente.nascimento
    });

    const clienteAtualizado = await knex('clientes').where({ id }).first();
    res.json(clienteAtualizado);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar cliente
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const cliente = await knex('clientes').where({ id }).first();
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    await knex('clientes').where({ id }).del();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 