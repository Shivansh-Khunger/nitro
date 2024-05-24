// Import necessary node Module(s)
import fs from "node:fs";

// Import necessary Module(s)
import handleError from "@utils/errorHandler";

export async function makeDevEnv(targetPath: string) {
    const targetDevEnvPath = `${targetPath}/.env.development`;
    const devEnvData = "NODE_ENV=development";
    try {
        await fs.promises.writeFile(targetDevEnvPath, devEnvData);
    } catch (err) {
        handleError(err);
    }
}

export async function makeProdEnv(targetPath: string) {
    const targetProdEnvPath = `${targetPath}/.env.production`;
    const prodEnvData = "NODE_ENV=production";
    try {
        await fs.promises.writeFile(targetProdEnvPath, prodEnvData);
    } catch (err) {
        handleError(err);
    }
}
