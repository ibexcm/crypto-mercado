import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  transports: [
    new transports.File({
      filename: "../tmp/logger.log",
      maxsize: 52428800,
      maxFiles: 5,
      format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
        format.json(),
      ),
    }),
    new transports.Console(),
  ],
});
