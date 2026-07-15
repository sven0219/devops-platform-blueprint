import express from "express";
import { fileURLToPath } from "node:url";

export function createApp() {
  const app = express();
  const serviceName = process.env.SERVICE_NAME || "demo-service";
  const environment = process.env.APP_ENV || "local";

  app.get("/", (_req, res) => {
    res.json({
      service: serviceName,
      environment,
      status: "ok"
    });
  });

  app.get("/healthz", (_req, res) => {
    res.json({ status: "healthy" });
  });

  return app;
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  const port = Number(process.env.PORT || 3000);
  createApp().listen(port, "0.0.0.0", () => {
    console.log(`demo-service listening on port ${port}`);
  });
}
