const { verificarToken } = require('../utils/jwtUtil');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ mensagem: 'Token não enviado.' });
    }

    const token = authHeader.split(' ')[1];
    const dados = verificarToken(token);

    if (!dados) {
        return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
    }

    // Anexa os dados do token na requisição para acesso nos controllers
    req.usuario = dados;
    next();
}

module.exports = authMiddleware;
