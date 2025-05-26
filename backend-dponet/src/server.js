const express = require('express');
const cors = require('cors');
const session = require('express-session');
const perguntasRoutes = require('./routes/perguntasRouters');

const app = express();

app.use(cors({
  origin: "https://lgpd-dponet-frontend.vercel.app",
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'chave-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'none'
  }
}));

app.use('/api', perguntasRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
