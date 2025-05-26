const express = require('express');
const router = express.Router();
const perguntasController = require('../controllers/perguntasController');
const middleware = require('../middleware/middleware');

// Rotas públicas
router.get('/perguntas', perguntasController.getTodasPerguntas); // Retorna todas as perguntas
router.post('/iniciar', perguntasController.iniciarQuestionario); // Inicia o questionário
router.post('/pdf', perguntasController.gerarPDFRespostas);       // Gera PDF

// Rotas protegidas
router.get('/pergunta', middleware, perguntasController.getPerguntaAtual);   // Retorna a pergunta atual
router.post('/responder', middleware, perguntasController.responderPergunta); // Salva resposta e avança
router.post('/resultado', middleware, perguntasController.calcularResultado);  // Calcula resultado final

module.exports = router;
