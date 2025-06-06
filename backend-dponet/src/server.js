const express = require('express');
const cors = require('cors');
const session = require('express-session');
const perguntasRoutes = require('./routes/perguntasRouters');

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'chave-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, sameSite: "lax" }
}));

app.use('/api', perguntasRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
