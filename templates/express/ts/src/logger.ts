// import pino & pino-http.
import pino from "pino";
import pinoHttp from "pino-http";

// import pino-pretty.
import pretty from "pino-pretty";

const stream = pretty({
    levelFirst: true,
    colorize: true,
    ignore: "time,hostname,pid",
});

export const logger = pino({}, stream);
export const httpLogger = pinoHttp({ logger: logger, autoLogging: false });
