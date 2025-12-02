# Correções Aplicadas para Deploy na Vercel

## Problemas Identificados e Corrigidos

### 1. ✅ Handler do tRPC Simplificado
- **Problema**: O handler anterior estava muito complexo e causava erros 500
- **Solução**: Simplificado para usar Express diretamente, que é suportado pela Vercel

### 2. ✅ Sistema de Armazenamento para Serverless
- **Problema**: O sistema tentava escrever em arquivos JSON, mas na Vercel o filesystem é read-only
- **Solução**: Implementado armazenamento em memória quando detectado ambiente serverless (VERCEL)
- **Nota**: Os dados são perdidos quando a função é reiniciada. Para produção, considere usar um banco de dados real.

### 3. ✅ Usuário Padrão Criado Automaticamente
- **Problema**: Não havia usuário inicial no ambiente serverless
- **Solução**: Sistema cria automaticamente o usuário padrão ao iniciar:
  - **Usuário**: `@userCliente96`
  - **Senha**: `@passwordCliente96`
  - **Role**: `admin`

### 4. ✅ Configuração do vercel.json
- Adicionado mais memória para as funções (1024MB)
- Adicionado rewrite explícito para `/api/trpc/:path*`

## Próximos Passos

### 1. Configurar Variáveis de Ambiente na Vercel

Acesse o Dashboard da Vercel e configure:

1. **JWT_SECRET** (OBRIGATÓRIO)
   - Vá em: Settings → Environment Variables
   - Adicione: `JWT_SECRET` com um valor seguro (mínimo 32 caracteres)
   - Exemplo de geração: `openssl rand -base64 32`

2. **NODE_ENV** (Recomendado)
   - Valor: `production`

### 2. Fazer Deploy

```bash
# Se já tem o projeto linkado
npx vercel --prod

# Ou faça push para o repositório conectado
git add .
git commit -m "Fix Vercel deployment"
git push
```

### 3. Verificar se Funcionou

1. Acesse: `https://seu-dominio.vercel.app/api/test`
   - Deve retornar: `{"status":"ok","message":"Serverless function is working",...}`

2. Acesse: `https://seu-dominio.vercel.app/login`
   - Faça login com:
     - Usuário: `@userCliente96`
     - Senha: `@passwordCliente96`

3. Verifique os logs:
   - Dashboard → Functions → `api/trpc/[...path]` → Logs
   - Procure por erros relacionados a `JWT_SECRET`

## Troubleshooting

### Erro: "Unexpected token 'A', 'A server e'..."
- **Causa**: O servidor está retornando HTML/texto em vez de JSON
- **Solução**: Verifique se `JWT_SECRET` está configurado. Este erro geralmente ocorre quando há um erro não tratado.

### Erro 500 no login
- **Causa**: Variável `JWT_SECRET` não configurada ou inválida
- **Solução**: Configure `JWT_SECRET` na Vercel e faça redeploy

### Dados não persistem
- **Causa**: Sistema usa armazenamento em memória (dados são perdidos quando a função reinicia)
- **Solução**: Para produção, migre para um banco de dados real (MySQL, PostgreSQL, etc.)

## Arquivos Modificados

- `api/trpc/[...path].ts` - Handler simplificado
- `server/db.ts` - Suporte para armazenamento em memória
- `vercel.json` - Configurações atualizadas
- `VERCEL_ENV_VARS.md` - Documentação de variáveis de ambiente

## Notas Importantes

⚠️ **Armazenamento em Memória**: Os dados (usuários e imóveis) são armazenados em memória e serão perdidos quando:
- A função serverless for reiniciada (cold start)
- Houver um novo deploy
- A função ficar inativa por muito tempo

Para um ambiente de produção real, você deve:
1. Configurar um banco de dados (MySQL, PostgreSQL, etc.)
2. Atualizar `server/db.ts` para usar o banco de dados
3. Configurar `DATABASE_URL` na Vercel

