const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');
const salesRoutes = require('./routes/sales');
const statsRoutes = require('./routes/stats');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas públicas
app.use('/auth', authRoutes);

// Rotas protegidas
app.use('/clientes', authMiddleware, clientesRoutes);
app.use('/sales', authMiddleware, salesRoutes);
app.use('/stats', authMiddleware, statsRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; 