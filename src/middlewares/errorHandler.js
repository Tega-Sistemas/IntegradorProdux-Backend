export default (err, req, res, next) => {
  if (err.status === 500) {
    return res.status(500).json({
      message: 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.',
      error: {}
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Erro inesperado no servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
};
