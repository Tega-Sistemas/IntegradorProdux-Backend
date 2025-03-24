export const validarComandoSql = (comando_sql) => {
  if (!comando_sql || typeof comando_sql !== 'string') {
    return true; // Se for vazio ou não string, deixa passar (ajusta conforme tua necessidade)
  }

  // Lista de comandos perigosos (case-insensitive)
  const comandosProibidos = [
    'update',
    'delete',
    'drop',
    'truncate',
    'insert',
    'alter',
    'create',
    'grant',
    'revoke',
  ];

  // Converte pra minúsculas pra checar
  const comandoLower = comando_sql.toLowerCase();

  // Verifica se contém algum comando proibido
  for (const comando of comandosProibidos) {
    if (comandoLower.includes(comando)) {
      return false;
    }
  }

  // Opcional: Garante que seja um SELECT
  if (!comandoLower.trim().startsWith('select')) {
    return false;
  }

  return true;
};