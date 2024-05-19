import setHeaders from "./config/headers";
import { httpLogger, logger } from "./logger";

import { PrismaClient } from "@prisma/client";
import express from "express";

const PORT = process.env.PORT || 3001;
const app = express();

const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(setHeaders);
app.use(httpLogger);

(async () => {
    try {
        await prisma.$connect();
        logger.info("db connected !");
    } catch (err) {
        logger.error(
            err,
            "-> an error has occured while connecting to the db!",
        );

        logger.fatal("server is closing... :[");
        process.exit(1);
    }
})();

if (process.env.NODE_ENV === "development") {
    app.get("/", (req, res) => {
        res.send("Welcome to api set up by node-nitro ^_+");
    });
}

app.listen(PORT, () => {
    logger.info(`-> now listening at http://localhost:${PORT}/`);
});
