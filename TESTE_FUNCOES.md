# Como Testar as Funções SEM Acessar o Painel do Netlify

## Teste 1: Função de Teste (hello)
Acesse no navegador ou use curl:
```
https://loja-imoveis-lar-imediato.netlify.app/.netlify/functions/hello
```

**Resultado esperado:**
- JSON: `{"message": "Hello from Netlify Function!", ...}` ✅ FUNCIONANDO
- HTML (index.html): ❌ NÃO FUNCIONA - catch-all está interceptando

## Teste 2: Função tRPC Diretamente
```
https://loja-imoveis-lar-imediato.netlify.app/.netlify/functions/trpc
```

**Resultado esperado:**
- JSON (mesmo que erro): ✅ FUNCIONANDO
- HTML: ❌ NÃO FUNCIONA

## Teste 3: Via Redirect /api/trpc
```
https://loja-imoveis-lar-imediato.netlify.app/api/trpc/auth.me
```

**Resultado esperado:**
- JSON: ✅ FUNCIONANDO
- HTML: ❌ Redirect não funcionando

## Sobre o Problema de Conta Duplicada no Netlify

**Solução:**
1. Acesse: https://app.netlify.com
2. Faça logout da conta atual
3. Tente fazer login novamente
4. Se pedir qual conta usar, escolha a correta
5. OU acesse: https://app.netlify.com/user/account
6. Em "Account settings" pode ter opção de gerenciar múltiplas contas

**Alternativa:**
- Use modo anônimo/privado do navegador
- Ou use outro navegador
- Ou entre em contato com suporte: support@netlify.com

## Status Atual (baseado nos testes)
- ✅ Funções criadas e commitadas
- ❌ Funções retornando HTML (não estão sendo chamadas)
- ❓ Verificar se o Netlify está buildando as funções

**Próximo passo:** Aguardar o deploy e testar novamente com os testes acima.
