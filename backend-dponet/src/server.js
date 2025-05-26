const express = require('express');
const cors = require('cors');
const perguntasRoutes = require('./routes/perguntasRouters');

const app = express();

app.use(cors({
  origin: "https://lgpd-dponet-frontend.vercel.app"
}));

app.use(express.json());

// Rotas
app.use('/api', perguntasRoutes);

// Start
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
