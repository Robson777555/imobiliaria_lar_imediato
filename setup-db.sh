#!/bin/bash

echo "🔧 Configuração do Banco de Dados - Imóveis Lar Imediato"
echo ""

# Verifica se o arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    exit 1
fi

# Lê a DATABASE_URL do .env
DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d '=' -f2 | tr -d '"')

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL não encontrada no arquivo .env"
    exit 1
fi

echo "📋 URL de conexão: $DATABASE_URL"
echo ""

# Extrai informações da URL
# Formato: mysql://usuario:senha@host:porta/nome_do_banco
USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

echo "📊 Informações extraídas:"
echo "   Usuário: $USER"
echo "   Host: $HOST"
echo "   Porta: $PORT"
echo "   Banco: $DB"
echo ""

# Tenta criar o banco de dados
echo "🔨 Tentando criar o banco de dados..."
if command -v mysql &> /dev/null; then
    if [ -n "$PASS" ] && [ "$PASS" != "password" ]; then
        mysql -u "$USER" -p"$PASS" -h "$HOST" -P "$PORT" -e "CREATE DATABASE IF NOT EXISTS $DB;" 2>&1
    else
        mysql -u "$USER" -h "$HOST" -P "$PORT" -e "CREATE DATABASE IF NOT EXISTS $DB;" 2>&1
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ Banco de dados criado com sucesso!"
    else
        echo "⚠️  Não foi possível criar o banco automaticamente."
        echo "   Execute manualmente: CREATE DATABASE IF NOT EXISTS $DB;"
    fi
else
    echo "⚠️  MySQL client não encontrado no PATH."
    echo "   Por favor, crie o banco manualmente:"
    echo "   CREATE DATABASE IF NOT EXISTS $DB;"
fi

echo ""
echo "🚀 Executando migrações..."
npx pnpm db:push

