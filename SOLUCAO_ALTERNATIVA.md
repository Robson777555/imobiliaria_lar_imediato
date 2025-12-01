# ⚠️ SOLUÇÃO ALTERNATIVA SE FUNÇÕES NÃO FUNCIONAREM

Se após o deploy, a função `minimal` também retornar HTML (tela de login),
significa que o Netlify **NÃO está buildando as funções**.

## Opção 1: Usar Servidor Backend Separado

Deployar o servidor Express em outro serviço (Render, Railway, Vercel) e
apontar o cliente para ele.

## Opção 2: Verificar Build do Netlify

O Netlify pode não estar detectando as funções porque:
- TypeScript precisa ser compilado
- Dependências não estão disponíveis
- Estrutura de diretórios incorreta

## Teste Final

Após deploy, teste:
```
https://loja-imoveis-lar-imediato.netlify.app/.netlify/functions/minimal
```

Se retornar JSON → funções funcionam, problema é no trpc
Se retornar HTML → Netlify não está buildando funções
