const express = require('express');
const router = express.Router();
const perguntasController = require('../controllers/perguntasController');

router.get('/perguntas', perguntasController.getTodasPerguntas); // Retorna todas as perguntas
router.get('/pergunta', perguntasController.getPerguntaAtual);   // Retorna a pergunta atual
router.post('/responder', perguntasController.responderPergunta); // Salva a resposta e avança
router.post('/resultado', perguntasController.calcularResultado); // Calcula a pontuação final
router.post('/iniciar', perguntasController.iniciarQuestionario); // Inicia o questionário com nível
router.post('/pdf', perguntasController.gerarPDFRespostas);

module.exports = router;
