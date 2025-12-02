#!/bin/bash

echo "🚀 Configurando projeto na Vercel..."
echo ""

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório do projeto"
    exit 1
fi

echo "1️⃣ Fazendo login na Vercel..."
npx vercel login

echo ""
echo "2️⃣ Linkando projeto..."
npx vercel link

echo ""
echo "3️⃣ Verificando variáveis de ambiente..."
npx vercel env ls

echo ""
echo "4️⃣ Fazendo deploy de produção..."
npx vercel --prod

echo ""
echo "✅ Configuração completa!"
echo "📝 Verifique a URL do deploy acima"
