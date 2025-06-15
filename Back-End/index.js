require('dotenv').config();
const cors = require('cors'); // ← ESTA LINHA É O QUE FALTOU
const express = require('express');
const app = express();
const usuarioRoutes = require('./routes/usuarioRoutes');
const enderecoRoutes = require('./routes/enderecoRoutes');
const quadraRoutes = require('./routes/quadraRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

app.use(express.json());
app.use(cors());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/enderecos', enderecoRoutes);
app.use('/api/quadras', quadraRoutes);
app.use('/api/reservas', reservaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
