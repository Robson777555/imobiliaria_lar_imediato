// Função super simples para garantir que seja detectada
exports.handler = async function(event) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      success: true,
      message: "Função SIMPLE-TEST está funcionando!",
      path: event.path,
      rawPath: event.rawPath,
      method: event.httpMethod,
    }),
  };
};

