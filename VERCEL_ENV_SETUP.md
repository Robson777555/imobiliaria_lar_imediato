# Guia de Configuração de Variáveis de Ambiente no Vercel

## Passo a Passo

### 1. Acesse a Página de Environment Variables
- No dashboard do Vercel, clique em **Settings** (já está selecionado)
- Role a página até encontrar a seção **"Environment Variables"**

### 2. Configure as Variáveis Essenciais

#### Variável 1: SESSION_SECRET (OBRIGATÓRIA)
Esta é a chave secreta para criptografar os tokens de sessão.

1. No campo **"Key"**, digite: `SESSION_SECRET`
2. No campo **"Value"**, gere uma chave secreta segura. Você pode usar:
   - Um gerador online: https://randomkeygen.com/
   - Ou execute no terminal: `openssl rand -base64 32`
   - Exemplo: `aB3dEf9GhIjKlMnOpQrStUvWxYz1234567890AbCdEf`
3. Em **"Environments"**, selecione: **"All Environments"** (ou selecione Production, Preview e Development separadamente)
4. Clique em **"Save"**

#### Variável 2: JWT_SECRET (OBRIGATÓRIA)
Esta é a chave secreta para assinar tokens JWT.

1. Clique em **"Add Another"** (ou crie uma nova variável)
2. No campo **"Key"**, digite: `JWT_SECRET`
3. No campo **"Value"**, use outra chave secreta diferente (pode ser igual à SESSION_SECRET, mas é melhor usar uma diferente)
   - Gere outra chave: `openssl rand -base64 32`
   - Exemplo: `XyZ9aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890AbCd`
4. Em **"Environments"**, selecione: **"All Environments"**
5. Clique em **"Save"**

### 3. Variáveis Opcionais (se necessário)

#### DATABASE_URL (se estiver usando banco de dados)
1. Key: `DATABASE_URL`
2. Value: Sua string de conexão do banco (ex: `mysql://user:password@host:port/database`)
3. Environments: All Environments
4. **Importante**: Marque como **"Sensitive"** se contiver senhas

#### VITE_APP_ID (se estiver usando OAuth)
1. Key: `VITE_APP_ID`
2. Value: Seu App ID do provedor OAuth
3. Environments: All Environments

#### OAUTH_SERVER_URL (se estiver usando OAuth)
1. Key: `OAUTH_SERVER_URL`
2. Value: URL do servidor OAuth
3. Environments: All Environments

### 4. Configurações Recomendadas

- **Sensitive Toggle**: Para variáveis que contêm senhas ou chaves secretas (SESSION_SECRET, JWT_SECRET, DATABASE_URL), ative o toggle **"Sensitive"** para que os valores não sejam visíveis após salvar.

- **Environments**: 
  - **Production**: Variáveis para produção
  - **Preview**: Variáveis para branches de preview
  - **Development**: Variáveis para desenvolvimento local (se usar Vercel CLI)

### 5. Após Configurar

⚠️ **IMPORTANTE**: Após adicionar/modificar variáveis de ambiente, você precisa fazer um novo deploy:

1. Vá para a aba **"Deployments"**
2. Clique nos três pontos (...) do último deployment
3. Selecione **"Redeploy"**
4. Ou faça um novo commit e push para o repositório

## Variáveis Mínimas Necessárias

Para o login funcionar corretamente, você precisa configurar pelo menos:

✅ **SESSION_SECRET** - Obrigatória
✅ **JWT_SECRET** - Obrigatória

## Gerando Chaves Secretas Seguras

No terminal, execute:
```bash
# Para SESSION_SECRET
openssl rand -base64 32

# Para JWT_SECRET (gere uma diferente)
openssl rand -base64 32
```

Ou use um gerador online: https://randomkeygen.com/

## Verificação

Após configurar e fazer o redeploy, teste:
1. Acesse sua URL de produção
2. Tente fazer login com: `@userCliente96` / `@passwordCliente96`
3. Se funcionar, as variáveis estão configuradas corretamente!

