import fs from "node:fs";

export async function makeDevEnv(targetPath: string) {
    try {
        const targetDevEnvPath = `${targetPath}/.env.development`;
        const devEnvData = "NODE_ENV=development";

        fs.writeFileSync(targetDevEnvPath, devEnvData);
    } catch (err) {}
}

export async function makeProdEnv(targetPath: string) {
    try {
        const targetProdEnvPath = `${targetPath}/.env.production`;
        const prodEnvData = "NODE_ENV=development";

        fs.writeFileSync(targetProdEnvPath, prodEnvData);
    } catch (err) {}
}
