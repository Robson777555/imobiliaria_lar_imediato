# Instruções para Debug do Problema de Login

## Problema
- Erro 404 ao acessar `/api/trpc/*`
- Função Netlify não está sendo encontrada

## Como Verificar

### 1. Verificar se as Funções foram Buildadas
1. Acesse: https://app.netlify.com
2. Vá em seu site: **loja-imoveis-lar-imediato**
3. Clique em **Functions** no menu lateral
4. Verifique se aparecem as funções:
   - `trpc` 
   - `hello` (função de teste)

**Se NÃO aparecerem as funções:**
- O problema é no build
- Verifique os logs do deploy na aba "Deploys"

### 2. Verificar os Logs da Função
1. Na aba **Functions**, clique na função `trpc`
2. Clique em **Logs** ou **Real-time logs**
3. Tente fazer login no site
4. **Verifique se aparecem logs** começando com `[TRPC FUNCTION]`

**Se NÃO aparecerem logs:**
- A função não está sendo chamada
- O problema é no redirect
- Verifique se o arquivo `_redirects` está sendo copiado

**Se aparecerem logs:**
- Copie TODOS os logs e me envie
- Os logs mostrarão exatamente onde está o problema

### 3. Testar Função de Teste
1. Acesse: `https://loja-imoveis-lar-imediato.netlify.app/.netlify/functions/hello`
2. Deve retornar JSON com `{"message": "Hello from Netlify Function!"}`

**Se retornar 404:**
- As funções não estão sendo buildadas
- Verifique a configuração do build

**Se retornar JSON:**
- As funções funcionam
- O problema é apenas no redirect do `/api/trpc`

### 4. Verificar Arquivo _redirects
1. Após o deploy, o arquivo deve estar em `dist/public/_redirects`
2. Conteúdo esperado:
```
/api/trpc/* /.netlify/functions/trpc?path=:splat 200!
/api/trpc /.netlify/functions/trpc 200!
```

## Próximos Passos

Com base no que você encontrar:
- Se as funções não aparecerem: problema de build/configuração
- Se as funções aparecerem mas não forem chamadas: problema no redirect
- Se aparecerem logs: me envie os logs para ajustar
