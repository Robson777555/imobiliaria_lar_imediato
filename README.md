# Lar Imediato - Projeto Imobiliária

## 🚀 Deploy no Netlify

O projeto está configurado para deploy automático no Netlify.

### URL do Site
- **Produção**: https://loja-imoveis-lar-imediato.netlify.app
- **Dashboard Netlify**: https://app.netlify.com
- **Configurações de Deploy**: https://app.netlify.com/teams/robson777555/sites/loja-imoveis-lar-imediato/configuration/deploys

### Configuração de Deploy Automático (CI/CD)

Para habilitar o deploy automático quando houver mudanças no GitHub:

1. Acesse o dashboard principal do Netlify: https://app.netlify.com
2. Na lista de sites, encontre e clique em **loja-imoveis-lar-imediato**
3. No menu lateral, clique em **Site settings**
4. Vá em **Build & deploy** → **Continuous Deployment**
5. Clique em **Link to Git provider** ou **Configure Netlify**
6. Selecione **GitHub** e autorize o acesso (se necessário)
7. Selecione o repositório: `Robson777555/loja_imoveis_Lar_Imediato`
8. Configure as seguintes opções:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
9. Clique em **Deploy site**

Após configurar, qualquer push na branch `main` do GitHub irá disparar um deploy automático no Netlify.

### Build Local

```bash
npm run build
```

### Deploy Manual

```bash
npx netlify-cli deploy --dir=dist/public --prod
```

### Estrutura do Projeto

- **Frontend**: React + Vite (em `client/`)
- **Backend**: Express + tRPC (em `server/`)
- **Build output**: `dist/public` (frontend)

### Variáveis de Ambiente

Certifique-se de configurar as variáveis de ambiente necessárias no painel do Netlify em **Site settings** → **Environment variables**.

