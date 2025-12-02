# Configuração Completa na Vercel CLI

## Passo 1: Fazer Login na Vercel

```bash
cd /Users/robsonjobim/Desktop/projeto_imobiliaria/imoveis-lar-imediato
npx vercel login
```

Isso abrirá o navegador para você fazer login.

## Passo 2: Configurar o Projeto

```bash
npx vercel link
```

Selecione:
- Criar novo projeto ou linkar com existente
- Escolha o time
- Confirme as configurações

## Passo 3: Verificar Configurações

```bash
npx vercel env ls
```

Verifique se todas as variáveis de ambiente necessárias estão configuradas.

## Passo 4: Adicionar Variáveis de Ambiente (se necessário)

```bash
npx vercel env add JWT_SECRET production
npx vercel env add DATABASE_URL production
# Adicione outras variáveis conforme necessário
```

## Passo 5: Fazer Deploy de Produção

```bash
npx vercel --prod
```

## Passo 6: Verificar Deploy

Após o deploy, acesse:
- A URL fornecida pela Vercel
- Teste: `https://seu-dominio.vercel.app/api/test` (deve retornar JSON)
- Teste login: `https://seu-dominio.vercel.app/login`

## Variáveis de Ambiente Necessárias

Certifique-se de que as seguintes variáveis estão configuradas na Vercel:

- `JWT_SECRET` - Secret para JWT tokens
- `DATABASE_URL` - URL do banco de dados (se aplicável)
- `NODE_ENV` - Deve ser `production`

Configure essas variáveis no painel da Vercel:
1. Dashboard → Seu Projeto → Settings → Environment Variables
2. Adicione cada variável para Production, Preview e Development

## Troubleshooting

### Se o deploy falhar:
1. Verifique os logs: `npx vercel logs`
2. Verifique o build local: `npm run build`
3. Verifique se todas as dependências estão instaladas

### Se a função não funcionar:
1. Verifique os logs da função: Dashboard → Functions → `api/trpc/[...path]` → Logs
2. Teste a função de teste: `/api/test`
3. Verifique se o arquivo está na pasta correta: `api/trpc/[...path].ts`

