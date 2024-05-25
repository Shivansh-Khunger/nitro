import fs from "node:fs";

import handleError from "./errorHandler";

export function deleteFile(targetFilePath: string) {
    try {
        fs.unlinkSync(targetFilePath);
    } catch (err) {
        handleError(err);
    }
}

export function updateFile(localFilePath: string, targetFilePath: string) {
    try {
        const localData = fs.readFileSync(localFilePath, "utf-8");

        fs.writeFileSync(targetFilePath, localData);
    } catch (err) {
        handleError(err);
    }
}

export function copyFile(localFilePath: string, targetFilePath: string) {
    try {
        fs.copyFileSync(localFilePath, targetFilePath);
    } catch (err) {
        handleError(err);
    }
}

export function appendFile(targetFilePath: string, appendData: string) {
    try {
        fs.appendFileSync(targetFilePath, appendData);
    } catch (err) {
        handleError(err);
    }
}
