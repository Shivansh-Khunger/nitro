import { exec } from "node:child_process";
import fs from "node:fs";

import type { T_UserInput, T_UserInputCli } from "../types/prompt";

import {
    appendFile,
    copyFile,
    deleteFile,
    updateFile,
} from "@utils/fileSystem";

function ifWantTs(userInput: T_UserInput) {
    switch (userInput.template) {
        case "express/js":
            return false;
        case "express/ts":
            return true;
        default:
            // TODO -> handle errors
            throw new Error("Invalid template");
    }
}

export async function updatePackageScript(targetPath: string) {
    const targetPackagePath = `${targetPath}/package.json`;

    const appendScripts = [
        {
            migrate:
                "dotenvx run --env-file=.env.development -- prisma migrate dev",
        },
    ];

    fs.readFile(targetPackagePath, "utf-8", (err, data) => {
        if (err) {
            // TODO -> handle errors
        }

        const targetData = JSON.parse(data);

        appendScripts.map((s) => {
            Object.assign(targetData.scripts, s);
        });

        fs.writeFile(targetPackagePath, JSON.stringify(targetData), (err) => {
            // TODO -> handle errors
        });
    });
}

async function x(
    userInput: T_UserInputCli,
    projectDirPath: string,
    targetPath: string,
) {
    const optionsDirPath = `${projectDirPath}/options`;
    let localOrmDirPath: string;
    const tagetSrcPath = `${targetPath}/src`;
    const targetOrmDirPath = `${tagetSrcPath}/config`;

    const targetEnvPath = `${targetPath}/.env.development`;
    let envAppendData = userInput.dsn;

    const wantTs = ifWantTs(userInput);

    switch (userInput.orm) {
        case "mongoose":
            envAppendData = `MONGO_URI=${envAppendData}`;
            appendFile(targetEnvPath, envAppendData);

            localOrmDirPath = `${optionsDirPath}/mongoose/${
                wantTs ? "ts" : "js"
            }`;

            updateFile(
                `${localOrmDirPath}/index.${wantTs ? "ts" : "js"}`,
                `${tagetSrcPath}/index.${wantTs ? "ts" : "js"}`,
            );

            copyFile(
                `${localOrmDirPath}/db.${wantTs ? "ts" : "js"}`,
                `${targetOrmDirPath}/db.${wantTs ? "ts" : "js"}`,
            );
            break;

        case "prisma": {
            envAppendData = `DATABASE_URL=${envAppendData}`;
            appendFile(targetEnvPath, envAppendData);

            exec("npx prisma init", { cwd: targetPath }, (err) => {
                if (err) {
                    // TODO -> handle errors
                }

                const defaultEnvPath = `${targetPath}/.env`;
                deleteFile(defaultEnvPath);
            });

            localOrmDirPath = `${optionsDirPath}/prisma/${
                wantTs ? "ts" : "js"
            }`;

            updateFile(
                `${localOrmDirPath}/index.${wantTs ? "ts" : "js"}`,
                `${tagetSrcPath}/index.${wantTs ? "ts" : "js"}`,
            );

            // updatePackageScript(targetPath);
            break;
        }

        default:
            // Handle other cases or throw an error
            break;
    }
}

export default x;
