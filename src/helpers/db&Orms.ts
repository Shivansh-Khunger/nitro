// Import necessary node Module(s)
import { exec } from "node:child_process";
import fs from "node:fs";

// Import necessary Type(s)
import type { T_UserInput, T_UserInputCli } from "../types/prompt";

// Import necessary Module(s)
import handleError from "@utils/errorHandler";
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
            throw new Error("Invalid template");
    }
}

function updatePackageScript(targetPath: string) {
    const targetPackagePath = `${targetPath}/package.json`;

    const appendScripts = [
        {
            migrate:
                "dotenvx run --env-file=.env.development -- prisma migrate dev",
        },
    ];

    try {
        const targetData = fs.readFileSync(targetPackagePath, "utf-8");
        const targetDataJson = JSON.parse(targetData);

        appendScripts.map((s) => {
            Object.assign(targetDataJson.scripts, s);
        });

        fs.writeFileSync(targetPackagePath, JSON.stringify(targetDataJson));
    } catch (err) {
        handleError(err);
    }
}

function addDbAndOrm(
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

    let localTypePath: string;
    const targetTypePath = `${targetPath}/types/enviorment.d.ts`;

    const wantTs = ifWantTs(userInput);

    if (userInput.orm === "mongoose") {
        envAppendData = `\nMONGO_URI=${envAppendData}`;
        appendFile(targetEnvPath, envAppendData);

        localOrmDirPath = `${optionsDirPath}/mongoose/${wantTs ? "ts" : "js"}`;

        localTypePath = `${localOrmDirPath}/enviorment.d.ts`;

        updateFile(
            `${localOrmDirPath}/index.${wantTs ? "ts" : "js"}`,
            `${tagetSrcPath}/index.${wantTs ? "ts" : "js"}`,
        );

        copyFile(
            `${localOrmDirPath}/db.${wantTs ? "ts" : "js"}`,
            `${targetOrmDirPath}/db.${wantTs ? "ts" : "js"}`,
        );

        if (wantTs) {
            updateFile(localTypePath, targetTypePath);
        }
    }
    if (userInput.orm === "prisma") {
        envAppendData = `\nDATABASE_URL=${envAppendData}`;
        appendFile(targetEnvPath, envAppendData);

        exec("npx prisma init", { cwd: targetPath }, (err) => {
            if (err) {
                handleError(err);
            }

            const defaultEnvPath = `${targetPath}/.env`;
            deleteFile(defaultEnvPath);
        });

        localOrmDirPath = `${optionsDirPath}/prisma/${wantTs ? "ts" : "js"}`;

        localTypePath = `${localOrmDirPath}/enviorment.d.ts`;

        updateFile(
            `${localOrmDirPath}/index.${wantTs ? "ts" : "js"}`,
            `${tagetSrcPath}/index.${wantTs ? "ts" : "js"}`,
        );

        if (wantTs) {
            updateFile(localTypePath, targetTypePath);
        }

        updatePackageScript(targetPath);
    }
}

export default addDbAndOrm;
