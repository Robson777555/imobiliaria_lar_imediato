# Deploy na Vercel

## Deploy Automático (Recomendado)

Se o projeto está conectado ao GitHub na Vercel, o deploy automático já foi iniciado após o último push.

Para verificar:
1. Acesse: https://vercel.com/dashboard
2. Clique no projeto `loja-imoveis-lar-imediato`
3. Verifique a aba "Deployments" para ver o status do deploy mais recente

## Deploy Manual via CLI

Se preferir fazer o deploy manualmente:

1. Instalar Vercel CLI (se ainda não tiver):
   ```bash
   npm install -g vercel
   ```

2. Fazer login:
   ```bash
   vercel login
   ```

3. Fazer deploy de produção:
   ```bash
   vercel --prod
   ```

## Verificar se o Deploy Funcionou

Após o deploy:

1. Acesse a URL fornecida pela Vercel
2. Deve aparecer a tela de login
3. Tente fazer login com:
   - **Usuário**: `@userCliente96`
   - **Senha**: `@passwordCliente96`

## Troubleshooting

Se o deploy falhar ou houver erros:

1. **Verificar Logs**: Na dashboard da Vercel → Functions → api/trpc/[...path] → Logs
2. **Verificar Build**: Na dashboard → Deployments → verificar os logs de build
3. **Verificar Variáveis de Ambiente**: Na dashboard → Settings → Environment Variables

## URLs Importantes

- Dashboard Vercel: https://vercel.com/dashboard
- Documentação: https://vercel.com/docs

