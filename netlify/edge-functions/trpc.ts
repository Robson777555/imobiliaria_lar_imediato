// Edge Function - pode funcionar melhor que Functions normais
export default async (request: Request) => {
  console.log("[EDGE FUNCTION] Called");
  
  return new Response(
    JSON.stringify({
      message: "Edge Function funciona!",
      url: request.url,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

