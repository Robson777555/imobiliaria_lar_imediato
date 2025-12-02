# 🚀 Instruções Rápidas - Configurar Vercel CLI

## Execute os comandos abaixo no terminal:

```bash
cd /Users/robsonjobim/Desktop/projeto_imobiliaria/imoveis-lar-imediato

# 1. Login na Vercel (abrirá o navegador)
npx vercel login

# 2. Linkar projeto com Vercel
npx vercel link

# 3. Deploy de produção
npx vercel --prod
```

## ✅ Ou use o script automático:

```bash
./setup-vercel.sh
```

## 📋 Variáveis de Ambiente Necessárias

Configure no painel da Vercel (Dashboard → Settings → Environment Variables):

1. **JWT_SECRET** - Secret para tokens JWT
2. **DATABASE_URL** - URL do banco de dados (se usar)
3. **NODE_ENV** - `production`

## 🔍 Verificar se Funcionou

1. Após o deploy, você receberá uma URL
2. Teste: `https://sua-url.vercel.app/api/test` → deve retornar JSON
3. Teste login: `https://sua-url.vercel.app/login`
   - Usuário: `@userCliente96`
   - Senha: `@passwordCliente96`

## ⚠️ Se Ainda Não Funcionar

Verifique os logs na Vercel:
- Dashboard → Functions → `api/trpc/[...path]` → Logs
- Os logs mostrarão exatamente o que está acontecendo

