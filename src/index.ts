import "dotenv/config";
import express, { json } from "express";
import { EnvKeys, getEnvValue } from "./utils/envHandler";
import cors from "cors";
import { respHandler } from "./utils/respHandler";
import router from "./routes";
import { logger } from "./utils/logger";
import { expressLogger, expressRequestLogger } from "./utils/expressLogger";

const PORT = getEnvValue(EnvKeys.port);
const app = express();

app.use(json());
app.use(cors());
app.use(expressLogger);
app.use(expressRequestLogger);

app.use(router);

app.get("/checkservice", (_, res) =>
  respHandler({ res, status: 200, data: { status: "ok" } })
);

app.listen(PORT, () =>
  logger.info(`Server running at: http://localhost:${PORT}`)
);
