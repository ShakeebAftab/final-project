import { createLogger, format, transports } from "winston";

const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message }) => {
    return `${level}: ${message}`;
  })
);

export const logger = createLogger({
  level: "info",
  format: format.combine(format.colorize(), format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
  ],
});
