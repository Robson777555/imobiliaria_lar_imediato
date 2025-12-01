// Função MÍNIMA sem nenhuma dependência externa
exports.handler = function(event, context, callback) {
  console.log("MINIMAL FUNCTION CALLED");
  
  callback(null, {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      success: true,
      message: "MINIMAL FUNCTION WORKS!",
      path: event.path,
    }),
  });
};

