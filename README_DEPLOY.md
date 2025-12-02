# 🚀 Guia Rápido de Deploy na Vercel

## ✅ Correções Aplicadas

Corrigi os seguintes problemas que estavam impedindo o login de funcionar:

1. **Handler do tRPC simplificado** - Agora usa Express corretamente na Vercel
2. **Sistema de armazenamento** - Adaptado para funcionar em ambiente serverless (read-only filesystem)
3. **Usuário padrão** - Criado automaticamente quando o sistema inicia
4. **Configuração do Vercel** - Atualizada com as configurações corretas

## 🔧 O Que Você Precisa Fazer Agora

### Passo 1: Configurar Variável de Ambiente OBRIGATÓRIA

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione:
   - **Key**: `JWT_SECRET`
   - **Value**: Gere um valor seguro (exemplo: `openssl rand -base64 32`)
   - **Environment**: Marque **Production**, **Preview** e **Development**
5. Clique em **Save**

### Passo 2: Fazer Deploy

```bash
cd /Users/robsonjobim/Desktop/projeto_imobiliaria/imoveis-lar-imediato
npx vercel --prod
```

Ou faça push para o repositório (se estiver conectado ao GitHub):

```bash
git add .
git commit -m "Fix Vercel deployment - login working"
git push
```

### Passo 3: Testar

1. Acesse sua URL da Vercel
2. Vá para `/login`
3. Faça login com:
   - **Usuário**: `@userCliente96`
   - **Senha**: `@passwordCliente96`

## 📋 Credenciais Padrão

- **Usuário**: `@userCliente96`
- **Senha**: `@passwordCliente96`
- **Role**: `admin`

Essas credenciais são criadas automaticamente quando o sistema inicia.

## ⚠️ Importante

O sistema atualmente usa **armazenamento em memória**, o que significa que:
- Os dados são perdidos quando a função serverless reinicia
- Não é adequado para produção com muitos usuários

Para produção, você deve configurar um banco de dados real e atualizar o código.

## 🐛 Se Ainda Não Funcionar

1. Verifique se `JWT_SECRET` está configurado na Vercel
2. Verifique os logs: Dashboard → Functions → `api/trpc/[...path]` → Logs
3. Teste o endpoint: `https://seu-dominio.vercel.app/api/test`
4. Verifique se o build foi bem-sucedido

## 📚 Documentação Adicional

- `VERCEL_ENV_VARS.md` - Lista completa de variáveis de ambiente
- `DEPLOY_FIX.md` - Detalhes técnicos das correções aplicadas

