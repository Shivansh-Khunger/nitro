// Import necessary node Module(s)
import fs from "node:fs";

// Import necessary Module(s)
import handleError from "@utils/errorHandler";

export function makeDevEnv(targetPath: string) {
    const targetDevEnvPath = `${targetPath}/.env.development`;
    const devEnvData = "NODE_ENV=development";
    try {
        fs.writeFileSync(targetDevEnvPath, devEnvData);
    } catch (err) {
        handleError(err);
    }
}

export function makeProdEnv(targetPath: string) {
    const targetProdEnvPath = `${targetPath}/.env.production`;
    const prodEnvData = "NODE_ENV=production";
    try {
        fs.writeFileSync(targetProdEnvPath, prodEnvData);
    } catch (err) {
        handleError(err);
    }
}
