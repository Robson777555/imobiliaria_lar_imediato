// Função JavaScript simples para testar se Netlify detecta funções JS
// CommonJS format (sem type: module no package.json para functions)
exports.handler = async function(event, context) {
  console.log("[TEST FUNCTION] Called!");
  console.log("[TEST FUNCTION] Event:", JSON.stringify(event, null, 2));
  
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message: "Função JavaScript funcionando!",
      path: event.path,
      rawPath: event.rawPath,
      httpMethod: event.httpMethod,
      timestamp: new Date().toISOString(),
    }),
  };
};

