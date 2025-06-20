const express = require('express');
const knex = require('../database/connection');

const router = express.Router();

// Total de vendas por dia
router.get('/daily-sales', async (req, res) => {
  try {
    const vendasPorDia = await knex('sales')
      .select('data')
      .sum('valor as total')
      .groupBy('data')
      .orderBy('data');

    res.json(vendasPorDia);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Estatísticas dos melhores clientes
router.get('/top-clients', async (req, res) => {
  try {
    // Cliente com maior volume de vendas
    const maiorVolume = await knex('sales')
      .join('clientes', 'sales.cliente_id', 'clientes.id')
      .select('clientes.id', 'clientes.nome', 'clientes.email')
      .sum('sales.valor as total_vendas')
      .groupBy('clientes.id', 'clientes.nome', 'clientes.email')
      .orderBy('total_vendas', 'desc')
      .first();

    // Cliente com maior média de valor por venda
    const maiorMedia = await knex('sales')
      .join('clientes', 'sales.cliente_id', 'clientes.id')
      .select('clientes.id', 'clientes.nome', 'clientes.email')
      .avg('sales.valor as media_valor')
      .groupBy('clientes.id', 'clientes.nome', 'clientes.email')
      .orderBy('media_valor', 'desc')
      .first();

    // Cliente com maior frequência de compras (mais dias únicos)
    const maiorFrequencia = await knex('sales')
      .join('clientes', 'sales.cliente_id', 'clientes.id')
      .select('clientes.id', 'clientes.nome', 'clientes.email')
      .countDistinct('sales.data as dias_unicos')
      .groupBy('clientes.id', 'clientes.nome', 'clientes.email')
      .orderBy('dias_unicos', 'desc')
      .first();

    res.json({
      maior_volume: maiorVolume || null,
      maior_media: maiorMedia || null,
      maior_frequencia: maiorFrequencia || null
    });
  } catch (error) {
    console.error('Erro em top-clients:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Resumo geral
router.get('/summary', async (req, res) => {
  try {
    // Total de vendas (soma)
    const totalVendasResult = await knex('sales').sum('valor as total').first();
    const totalVendas = totalVendasResult ? Number(totalVendasResult.total) : 0;

    // Quantidade de vendas
    const qtdVendasResult = await knex('sales').count('* as qtd').first();
    const qtdVendas = qtdVendasResult ? Number(qtdVendasResult.qtd) : 0;

    // Total de clientes
    const totalClientesResult = await knex('clientes').count('* as total').first();
    const totalClientes = totalClientesResult ? Number(totalClientesResult.total) : 0;

    // Ticket médio
    const ticketMedio = qtdVendas > 0 ? totalVendas / qtdVendas : 0;

    res.json({
      totalVendas,
      qtdVendas,
      totalClientes,
      ticketMedio
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar resumo' });
  }
});

module.exports = router; 