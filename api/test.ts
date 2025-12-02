export default async function handler(req: any, res: any) {
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    status: "ok",
    message: "Serverless function is working",
    timestamp: new Date().toISOString(),
  });
}

