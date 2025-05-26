const { calcularPontuacao } = require('../services/calculoPontuacao');
const perguntas = require('../data/perguntas.json');
const { gerarPdfQuestionario } = require('../utils/pdfUtil');
const { gerarToken, verificarToken } = require('../utils/jwtUtil');

// Helper para pegar dados do token
function getDadosToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    return verificarToken(token);
}

// Retorna todas as perguntas
exports.getTodasPerguntas = (req, res) => {
    res.json(perguntas);
};

// Iniciar o questionário
exports.iniciarQuestionario = (req, res) => {
    const { nivel } = req.body;

    if (!['iniciante', 'intermediario', 'avancado'].includes(nivel)) {
        return res.status(400).json({ mensagem: 'Nível inválido.' });
    }

    const token = gerarToken({
        nivel,
        perguntaIndex: 0,
        respostas: []
    });

    res.json({ mensagem: `Questionário iniciado no nível ${nivel}.`, token });
};

// Retorna a pergunta atual
exports.getPerguntaAtual = (req, res) => {
    const dados = getDadosToken(req);
    if (!dados) {
        return res.status(401).json({ mensagem: 'Token inválido ou ausente.' });
    }

    const { nivel, perguntaIndex = 0 } = dados;
    const perguntasFiltradas = perguntas.filter(p => p.nivel === nivel);

    if (perguntaIndex >= perguntasFiltradas.length) {
        return res.json({ mensagem: "Todas as perguntas foram respondidas!" });
    }

    res.json({ ...perguntasFiltradas[perguntaIndex], index: perguntaIndex + 1 });
};

// Responder pergunta
exports.responderPergunta = (req, res) => {
    const dados = getDadosToken(req);
    if (!dados) {
        return res.status(401).json({ mensagem: 'Token inválido ou ausente.' });
    }

    const { resposta } = req.body;
    const { nivel, perguntaIndex = 0, respostas = [] } = dados;

    const perguntasFiltradas = perguntas.filter(p => p.nivel === nivel);

    if (!perguntasFiltradas[perguntaIndex]) {
        return res.status(400).json({ mensagem: "Todas as perguntas foram respondidas!" });
    }

    const perguntaAtual = perguntasFiltradas[perguntaIndex];

    const novasRespostas = [...respostas, { pergunta_id: perguntaAtual.id, resposta }];
    const novoIndex = perguntaIndex + 1;

    if (novoIndex < perguntasFiltradas.length) {
        const novoToken = gerarToken({ nivel, perguntaIndex: novoIndex, respostas: novasRespostas });
        res.json({
            proximaPergunta: perguntasFiltradas[novoIndex],
            token: novoToken
        });
    } else {
        const novoToken = gerarToken({ nivel, perguntaIndex: novoIndex, respostas: novasRespostas });
        res.json({
            mensagem: "Todas as perguntas foram respondidas!",
            token: novoToken
        });
    }
};

// Calcular resultado
exports.calcularResultado = (req, res) => {
    const dados = getDadosToken(req);
    if (!dados) {
        return res.status(401).json({ mensagem: 'Token inválido ou ausente.' });
    }

    const { nivel, respostas = [], perguntaIndex } = dados;
    const perguntasFiltradas = perguntas.filter(p => p.nivel === nivel);

    if (respostas.length < perguntasFiltradas.length) {
        return res.status(400).json({
            mensagem: `Ainda há perguntas pendentes. Respondeu ${respostas.length} de ${perguntasFiltradas.length}.`
        });
    }

    const resultado = calcularPontuacao(respostas, nivel);

    if (resultado.mensagem) {
        return res.status(400).json({ mensagem: resultado.mensagem });
    }

    res.json({ resultado });
};

// Gerar PDF
exports.gerarPDFRespostas = (req, res) => {
    const { respostas, perguntas, nivel } = req.body;

    if (!respostas || !Array.isArray(respostas) || !nivel || !perguntas) {
        return res.status(400).json({ erro: 'Respostas, perguntas e nível são obrigatórios.' });
    }

    try {
        const pdfBuffer = gerarPdfQuestionario({ respostas, perguntas, nivel });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="relatorio-lgpd.pdf"',
        });

        res.send(pdfBuffer);
    } catch (err) {
        console.error('Erro ao gerar PDF:', err);
        res.status(500).json({ erro: 'Erro ao gerar o PDF.' });
    }
};
