# 🔧 Troubleshooting - Problemas no Deploy

## Erro: "Unexpected token 'A', 'A server e'..."

Este erro indica que o servidor está retornando HTML/texto em vez de JSON. Isso geralmente acontece quando:

### 1. JWT_SECRET não está configurado

**Sintoma**: Erro 500 ao tentar fazer login

**Solução**:
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione:
   - **Key**: `JWT_SECRET`
   - **Value**: Gere um valor seguro (ex: `openssl rand -base64 32`)
   - **Environment**: Marque Production, Preview e Development
5. Clique em **Save**
6. Faça um **Redeploy** (Deployments → Redeploy)

### 2. Verificar Logs na Vercel

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Functions** → `api/trpc/[...path]`
4. Clique em **Logs**
5. Procure por:
   - `[ERROR] JWT_SECRET não está configurado`
   - `[tRPC Error]`
   - `[Express Error]`

### 3. Testar Endpoints

Teste estes endpoints para diagnosticar:

```bash
# Teste 1: Health check
curl https://seu-dominio.vercel.app/api/test

# Deve retornar:
# {"status":"ok","message":"Serverless function is working",...}

# Teste 2: tRPC endpoint
curl https://seu-dominio.vercel.app/api/trpc/auth.me

# Deve retornar JSON (pode ser null se não estiver logado)
```

### 4. Verificar Build

Certifique-se de que o build está funcionando:

```bash
npm run build
```

Se houver erros, corrija antes de fazer deploy.

### 5. Verificar Variáveis de Ambiente

Certifique-se de que TODAS estas variáveis estão configuradas:

- ✅ `JWT_SECRET` (OBRIGATÓRIO)
- ✅ `NODE_ENV=production` (Recomendado)

### 6. Limpar Cache e Redeploy

1. Na Vercel, vá em **Settings** → **General**
2. Role até **Clear Build Cache**
3. Clique em **Clear**
4. Faça um novo deploy

## Erro: "Failed to load resource: the server responded with a status of 500"

### Possíveis Causas:

1. **JWT_SECRET não configurado** (mais comum)
2. **Erro no código do servidor**
3. **Dependências faltando**

### Como Diagnosticar:

1. Verifique os logs da função na Vercel
2. Teste o endpoint `/api/test` primeiro
3. Se `/api/test` funcionar mas `/api/trpc` não, o problema está no handler do tRPC

## Erro: "Unexpected token 'A', 'A server e'..." ao fazer login

Este erro específico significa que:
- O servidor está retornando uma página de erro HTML em vez de JSON
- Geralmente acontece quando há um erro não tratado no servidor

### Solução:

1. Verifique se `JWT_SECRET` está configurado
2. Verifique os logs da função
3. Certifique-se de que o handler está retornando JSON sempre

## Checklist de Verificação

Antes de reportar um problema, verifique:

- [ ] `JWT_SECRET` está configurado na Vercel
- [ ] Fiz um redeploy após configurar as variáveis
- [ ] O build local funciona (`npm run build`)
- [ ] Verifiquei os logs na Vercel
- [ ] Testei o endpoint `/api/test`
- [ ] Limpei o cache do build

## Como Obter Ajuda

Se o problema persistir:

1. Copie os logs da função da Vercel
2. Teste os endpoints com `curl` e copie as respostas
3. Verifique se há erros no console do navegador
4. Documente os passos que você seguiu

## Comandos Úteis

```bash
# Testar build local
npm run build

# Testar servidor local (se configurado)
npm run dev

# Verificar variáveis de ambiente locais
echo $JWT_SECRET

# Gerar novo JWT_SECRET
openssl rand -base64 32
```

