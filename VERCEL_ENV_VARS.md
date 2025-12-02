# Variáveis de Ambiente Necessárias na Vercel

Para que o projeto funcione corretamente na Vercel, você precisa configurar as seguintes variáveis de ambiente:

## Variáveis Obrigatórias

### JWT_SECRET
- **Descrição**: Secret usado para assinar e verificar tokens JWT de sessão
- **Exemplo**: `seu-secret-super-seguro-aqui-minimo-32-caracteres`
- **Como gerar**: Use um gerador de strings aleatórias ou: `openssl rand -base64 32`
- **Onde configurar**: Vercel Dashboard → Seu Projeto → Settings → Environment Variables

### NODE_ENV
- **Valor**: `production`
- **Descrição**: Define o ambiente como produção

## Variáveis Opcionais

### DATABASE_URL
- **Descrição**: URL de conexão com banco de dados (se usar banco de dados real)
- **Nota**: Atualmente o projeto usa armazenamento em memória na Vercel

### VITE_APP_ID
- **Descrição**: ID da aplicação (para OAuth, se usar)
- **Padrão**: Vazio (não obrigatório para login com senha)

### OAUTH_SERVER_URL
- **Descrição**: URL do servidor OAuth (se usar OAuth)
- **Padrão**: Vazio (não obrigatório para login com senha)

### OWNER_OPEN_ID
- **Descrição**: OpenID do proprietário/admin (se usar OAuth)
- **Padrão**: Vazio (não obrigatório para login com senha)

## Como Configurar na Vercel

1. Acesse o [Dashboard da Vercel](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione cada variável:
   - **Key**: Nome da variável (ex: `JWT_SECRET`)
   - **Value**: Valor da variável
   - **Environment**: Selecione **Production**, **Preview** e **Development** (ou apenas Production)
5. Clique em **Save**

## Verificação

Após configurar as variáveis, faça um novo deploy:

```bash
npx vercel --prod
```

Ou através do dashboard da Vercel, clique em **Redeploy**.

## Credenciais de Login Padrão

- **Usuário**: `@userCliente96`
- **Senha**: `@passwordCliente96`

Essas credenciais são criadas automaticamente quando o sistema inicia em ambiente serverless.

## Troubleshooting

Se o login não funcionar após configurar as variáveis:

1. Verifique se `JWT_SECRET` está configurado
2. Verifique os logs da função: Dashboard → Functions → `api/trpc/[...path]` → Logs
3. Teste o endpoint de health: `https://seu-dominio.vercel.app/api/test`
4. Verifique se o build foi bem-sucedido

