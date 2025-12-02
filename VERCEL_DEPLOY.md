# Deploy na Vercel

## Pré-requisitos

1. Conta na Vercel (https://vercel.com)
2. Repositório no GitHub conectado

## Configuração do Deploy

### 1. Conectar o Repositório

1. Acesse https://vercel.com/dashboard
2. Clique em **Add New Project**
3. Selecione o repositório `Robson777555/loja_imoveis_Lar_Imediato`
4. Clique em **Import**

### 2. Configurações do Projeto

A Vercel detectará automaticamente as configurações do `vercel.json`:

- **Build Command**: `npm run build` (automático)
- **Output Directory**: `dist/public` (automático)
- **Install Command**: `npm install` (automático)

### 3. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no painel da Vercel:

**Configurações básicas:**
- `NODE_ENV=production`

**Banco de Dados (se necessário):**
- Variáveis de conexão do banco de dados (conforme seu arquivo `.env`)

**Outras variáveis:**
- Todas as variáveis necessárias do arquivo `.env` local

### 4. Deploy

Após configurar, clique em **Deploy**. A Vercel irá:

1. Instalar dependências
2. Executar o build (`npm run build`)
3. Deployar o projeto

## Estrutura do Projeto na Vercel

- **Frontend**: Servido como arquivos estáticos de `dist/public`
- **API**: Serverless function em `api/index.ts` que serve:
  - API tRPC em `/api/trpc`
  - OAuth em `/api/oauth`
  - Arquivos estáticos (fallback para SPA routing)

## Autenticação

O projeto requer autenticação obrigatória:

- **Usuário**: `@userCliente96`
- **Senha**: `@passwordCliente96`

Todas as rotas (exceto `/login`, `/politica-privacidade`, `/termos-servico`) são protegidas e redirecionam para a página de login se o usuário não estiver autenticado.

## Verificação Pós-Deploy

1. Acesse a URL fornecida pela Vercel
2. Deve ser redirecionado automaticamente para `/login`
3. Faça login com as credenciais acima
4. Após login, será redirecionado para a página inicial

## Troubleshooting

### Erro: "Build directory not found"
- Certifique-se de que o build está sendo executado corretamente
- Verifique se `dist/public` existe após o build

### Erro: "API não funciona"
- Verifique se as variáveis de ambiente estão configuradas
- Verifique os logs da função serverless na Vercel

### Login não funciona
- Verifique se o banco de dados está configurado corretamente
- Verifique se o usuário foi criado (execute `npm run db:push` localmente primeiro)

