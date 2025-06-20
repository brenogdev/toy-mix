const express = require('express');
const knex = require('../database/connection');

const router = express.Router();

// Listar vendas
router.get('/', async (req, res) => {
  try {
    const { cliente_id, dataInicial, dataFinal } = req.query;
    const pagina = parseInt(req.query.pagina) || 1;
    const porPagina = parseInt(req.query.porPagina) || 5;

    let query = knex('sales')
      .join('clientes', 'sales.cliente_id', 'clientes.id')
      .select('sales.*', 'clientes.nome as cliente_nome');

    if (cliente_id) {
      query = query.where('sales.cliente_id', cliente_id);
    }
    if (dataInicial) {
      query = query.where('sales.data', '>=', dataInicial);
    }
    if (dataFinal) {
      query = query.where('sales.data', '<=', dataFinal);
    }

    // Conta total de vendas para paginação (sem join)
    const totalQuery = knex('sales')
      .modify((qb) => {
        if (cliente_id) qb.where('cliente_id', cliente_id);
      })
      .count('* as total')
      .first();

    // Soma total do valor das vendas filtradas
    const somaValorQuery = knex('sales')
      .modify((qb) => {
        if (cliente_id) qb.where('cliente_id', cliente_id);
      })
      .sum('valor as totalValor')
      .first();

    // Busca vendas paginadas e ordenadas (com join)
    const vendasQuery = query
      .orderBy('sales.data', 'desc')
      .limit(porPagina)
      .offset((pagina - 1) * porPagina);

    const [totalResult, somaValorResult, vendas] = await Promise.all([totalQuery, somaValorQuery, vendasQuery]);
    const total = totalResult ? Number(totalResult.total) : 0;
    const totalValor = somaValorResult ? Number(somaValorResult.totalValor) : 0;

    res.json({
      vendas,
      meta: {
        total,
        totalValor,
        pagina,
        porPagina
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registrar venda
router.post('/', async (req, res) => {
  try {
    const { cliente_id, data, valor } = req.body;

    if (!cliente_id || !data || !valor) {
      return res.status(400).json({ error: 'Cliente, data e valor são obrigatórios' });
    }

    // Verificar se o cliente existe
    const cliente = await knex('clientes').where({ id: cliente_id }).first();
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const [vendaId] = await knex('sales')
      .insert({
        cliente_id,
        data,
        valor
      })
      .returning('id');

    // Compatível com diferentes bancos (id pode ser número ou objeto)
    let id = vendaId;
    if (typeof vendaId === 'object' && vendaId !== null && 'id' in vendaId) {
      id = vendaId.id;
    }

    const venda = await knex('sales')
      .join('clientes', 'sales.cliente_id', 'clientes.id')
      .where('sales.id', id)
      .select('sales.*', 'clientes.nome as cliente_nome')
      .first();

    res.status(201).json(venda);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Editar venda
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente_id, data, valor } = req.body;

    const venda = await knex('sales').where({ id }).first();
    if (!venda) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }

    await knex('sales').where({ id }).update({
      cliente_id: cliente_id || venda.cliente_id,
      data: data || venda.data,
      valor: valor || venda.valor
    });

    const vendaAtualizada = await knex('sales')
      .join('clientes', 'sales.cliente_id', 'clientes.id')
      .where('sales.id', id)
      .select('sales.*', 'clientes.nome as cliente_nome')
      .first();

    res.json(vendaAtualizada);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar venda
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const venda = await knex('sales').where({ id }).first();
    if (!venda) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }

    await knex('sales').where({ id }).del();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 