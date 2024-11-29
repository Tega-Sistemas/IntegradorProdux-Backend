#!/bin/bash

# Saída detalhada para o terminal
set -e

echo "====== Instalando o PM2 global ======"
npm install -g pm2

echo "=== Iniciando o processo de build ==="

# Instalar dependências
echo ">>> Instalando dependências..."
npm install

# Garantir que o arquivo .env exista
if [ ! -f .env ]; then
  echo ">>> ERRO: Arquivo .env não encontrado na raiz do projeto."
  exit 1
fi
echo ">>> Arquivo .env encontrado."

read -p "Informe o nome da aplicação: " NOME

# Criar arquivo de configuração PM2
echo ">>> Gerando arquivo de configuração PM2..."
cat > pm2.config.cjs <<EOL
module.exports = {
  apps: [
    {
      name: "$NOME", // Nome da aplicação
      script: "./src/index.js", // Caminho para o arquivo principal
      watch: false, // Se quiser monitorar mudanças, mude para true
      env: {
        NODE_ENV: "production",
        DOTENV_CONFIG_PATH: "./.env", // Caminho para o arquivo .env
      },
    },
  ],
};
EOL

# Iniciar a aplicação com o PM2
echo ">>> Iniciando a aplicação no PM2..."
pm2 start pm2.config.cjs

# Salvar configuração no PM2 para reiniciar automaticamente
echo ">>> Salvando configuração PM2..."
pm2 save

# Mostrar o status da aplicação no PM2
echo ">>> Status da aplicação no PM2:"
pm2 status

echo "=== Processo inicialização concluído! ==="
