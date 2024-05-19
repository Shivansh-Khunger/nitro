import { logger } from "@logger";

import mongoose from "mongoose";

async function connectToDb() {
    await mongoose
        .connect(process.env.MONGO_URI as string)
        .then(() => {
            logger.info("db connected !");
        })
        .catch((err) => {
            logger.error(
                err,
                "-> an error has occured while connecting to the db!",
            );

            logger.fatal("server is closing... :[");
            process.exit(1);
        });
}

export default connectToDb;
