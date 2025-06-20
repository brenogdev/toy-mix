const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const knex = require('../database/connection');

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await knex('users').where({ username }).first();
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Registro (opcional para testes)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await knex('users').where({ username }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const [userId] = await knex('users')
      .insert({
        username,
        password_hash: passwordHash
      })
      .returning('id');

    const token = jwt.sign({ id: userId, username }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router; 