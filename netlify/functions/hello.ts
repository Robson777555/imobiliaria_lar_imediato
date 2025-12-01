// Test function to verify Netlify Functions are working
export const handler = async (event: any) => {
  console.log("[HELLO FUNCTION] Called with:", JSON.stringify(event, null, 2));
  
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Hello from Netlify Function!",
      event: {
        path: event.path,
        rawPath: event.rawPath,
        httpMethod: event.httpMethod,
      }
    }),
  };
};

