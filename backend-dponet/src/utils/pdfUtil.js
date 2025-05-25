const { jsPDF } = require('jspdf');

/**
 * Gera um PDF com perguntas e respostas do questionário LGPD
 * @param {{ respostas: { pergunta_id: number, resposta: string }[], perguntas: { id: number, pergunta: string }[], nivel: string }}
 * @returns {Buffer} - Buffer do PDF gerado
 */
function gerarPdfQuestionario({ respostas, perguntas, nivel }) {
    const doc = new jsPDF();
    const margemX = 20;
    const larguraTexto = 170;
    const alturaMaxPagina = 270;
    let y = 25;

    const agora = new Date();
    const dataAtual = agora.toLocaleDateString('pt-BR');
    const horaAtual = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO DO QUESTIONÁRIO LGPD', 105, y, { align: 'center' });
    y += 10;

    // Cabeçalho com data/hora centralizado
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Data: ${dataAtual} ${horaAtual} | Nível: ${nivel.charAt(0).toUpperCase() + nivel.slice(1)}`, 105, y, { align: 'center' });
    y += 10;

    respostas.forEach((r, i) => {
        const perguntaEncontrada = perguntas.find(p => p.id === r.pergunta_id);
        const perguntaTexto = perguntaEncontrada?.pergunta || `Pergunta não encontrada (ID ${r.pergunta_id})`;
        const respostaTexto = r.resposta || 'Resposta não disponível';

        const linhasPergunta = doc.splitTextToSize(`Pergunta ${i + 1}: ${perguntaTexto}`, larguraTexto);
        const alturaPergunta = linhasPergunta.length * 6;
        const linhasResposta = doc.splitTextToSize(`Resposta: ${respostaTexto}`, larguraTexto);
        const alturaResposta = linhasResposta.length * 6;

        if (y + alturaPergunta + alturaResposta > alturaMaxPagina) {
            doc.addPage();
            y = 25;
        }

        doc.setFont('helvetica', 'bold');
        doc.text(linhasPergunta, margemX, y);
        y += alturaPergunta + 2;

        doc.setFont('helvetica', 'normal');
        doc.text(linhasResposta, margemX, y);
        y += alturaResposta + 4; // Menor espaçamento entre perguntas
    });

    // Rodapé com texto personalizado centralizado
    const textoRodape = 'Relatório gerado automaticamente por OS TREM BALA';
    doc.setFontSize(10);
    doc.text(textoRodape, 105, 280, { align: 'center' });

    return Buffer.from(doc.output('arraybuffer'));
}

module.exports = { gerarPdfQuestionario };
