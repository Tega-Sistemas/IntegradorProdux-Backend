// middlewares/errorHandler.js
export default (err, req, res, next) => {
    console.error(err); // Loga o erro no servidor (melhorar com um logger mais robusto em produção)
  
    // Retorna uma resposta amigável para o cliente
    if (err.status === 500) {
      return res.status(500).json({
        message: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
        error: {}  // Em produção, não envie detalhes do erro
      });
    }
  
    // Para outros tipos de erro, envie a mensagem apropriada
    res.status(err.status || 500).json({
      message: err.message || 'Erro inesperado no servidor',
      error: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
  };
  