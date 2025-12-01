# Lar Imediato - Projeto Imobiliária

## 🚀 Deploy no Netlify

O projeto está configurado para deploy automático no Netlify.

### URL do Site
- **Produção**: https://loja-imoveis-lar-imediato.netlify.app
- **Painel Admin**: https://app.netlify.com/projects/loja-imoveis-lar-imediato

### Configuração de Deploy Automático (CI/CD)

Para habilitar o deploy automático quando houver mudanças no GitHub:

1. Acesse o painel do Netlify: https://app.netlify.com/projects/loja-imoveis-lar-imediato
2. Vá em **Site settings** → **Build & deploy** → **Continuous Deployment**
3. Clique em **Link to Git provider** ou **Configure Netlify**
4. Selecione **GitHub** e autorize o acesso
5. Selecione o repositório: `Robson777555/loja_imoveis_Lar_Imediato`
6. Configure as seguintes opções:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`

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

