const { calcularPontuacao } = require('../services/calculoPontuacao');
const perguntas = require('../data/perguntas.json');
const { gerarPdfQuestionario } = require('../utils/pdfUtil');

// Retorna todas as perguntas do JSON
exports.getTodasPerguntas = (req, res) => {
    res.json(perguntas);
};

// Iniciar o questionário com base no nível escolhido
exports.iniciarQuestionario = (req, res) => {
    const { nivel } = req.body;

    if (!['iniciante', 'intermediario', 'avancado'].includes(nivel)) {
        return res.status(400).json({ mensagem: 'Nível inválido.' });
    }

    req.session.nivel = nivel;
    req.session.perguntaIndex = 0;
    req.session.respostas = [];

    res.json({ mensagem: `Questionário iniciado no nível ${nivel}.` });
};

// Retorna a próxima pergunta com base no nível selecionado
exports.getPerguntaAtual = (req, res) => {
    const nivel = req.session.nivel;
    if (!nivel) {
        return res.status(400).json({ mensagem: 'Nível não selecionado.' });
    }

    const perguntasFiltradas = perguntas.filter(p => p.nivel === nivel);
    const index = req.session.perguntaIndex || 0;

    if (index >= perguntasFiltradas.length) {
        return res.json({ mensagem: "Todas as perguntas foram respondidas!" });
    }

    res.json({ ...perguntasFiltradas[index], index: index + 1 });
};

// Salva a resposta da pergunta atual e avança para a próxima
exports.responderPergunta = (req, res) => {
    const { resposta } = req.body;

    // Se a sessão não estiver inicializada, inicializa
    if (typeof req.session.perguntaIndex === "undefined") {
        req.session.perguntaIndex = 0;
        req.session.respostas = [];
    }

    const { nivel } = req.session;
    const perguntasFiltradas = perguntas.filter(p => p.nivel === nivel);
    const index = req.session.perguntaIndex;

    // Verifica se a pergunta atual existe
    if (!perguntasFiltradas[index]) {
        return res.status(400).json({ mensagem: "Todas as perguntas foram respondidas!" });
    }

    const perguntaAtual = perguntasFiltradas[index];

    console.log("Recebida resposta:", resposta);
    console.log("Pergunta ID:", perguntaAtual.id);
    console.log("Índice da sessão antes:", index);

    // Salva a resposta da pergunta atual
    req.session.respostas.push({ pergunta_id: perguntaAtual.id, resposta });
    req.session.perguntaIndex++; // Avança para a próxima pergunta

    console.log("Índice da sessão depois:", req.session.perguntaIndex);
    console.log("respostas length:", req.session.respostas.length);

    req.session.save((err) => {
        if (err) {
            console.error("Erro ao salvar sessão:", err);
            return res.status(500).json({ mensagem: "Erro ao salvar progresso da sessão." });
        }

        // Verifica se ainda há perguntas a serem respondidas
        if (req.session.perguntaIndex < perguntasFiltradas.length) {
            res.json({ proximaPergunta: perguntasFiltradas[req.session.perguntaIndex] });
        } else {
            res.json({ mensagem: "Todas as perguntas foram respondidas!" });
        }
    });
};

// Calcula o resultado final após todas as respostas
exports.calcularResultado = (req, res) => {
    try {
        console.log("Sessão no /resultado:", req.session);

        const { respostas, nivel } = req.session;

        if (!respostas || !nivel) {
            return res.status(400).json({ mensagem: "Dados insuficientes para calcular o resultado." });
        }

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

        req.session.destroy((err) => {
            if (err) {
                console.error("Erro ao destruir sessão:", err);
                return res.status(500).json({ mensagem: "Erro ao finalizar a sessão." });
            }

            res.json({ resultado });
        });
    } catch (error) {
        console.error("Erro ao calcular resultado:", error);
        res.status(500).json({ mensagem: "Erro interno ao processar a pontuação." });
    }
};

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
