import { format, transports } from "winston";
import { logger } from "express-winston";

export const expressLogger = logger({
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  meta: false,
  expressFormat: true,
  colorize: true,
});

export const expressRequestLogger = logger({
  transports: [
    new transports.File({
      filename: "logs/requests.log",
    }),
  ],
  meta: true,
  expressFormat: false,
  bodyBlacklist: ["password"],
});
