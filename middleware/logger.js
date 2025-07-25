import winston from "winston";

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "cyan",
    http: "green",
    debug: "gray",
  },
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
  level: "http",
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: "YY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp} ${level}: ${message}]`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
