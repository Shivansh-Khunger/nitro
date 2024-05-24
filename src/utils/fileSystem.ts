import fs from "node:fs";

import handleError from "./errorHandler";

export function deleteFile(targetFilePath: string) {
    fs.unlink(targetFilePath, (err) => {
        if (err) {
            handleError(err);
        }
    });
}

export async function updateFile(
    localFilePath: string,
    targetFilePath: string,
) {
    fs.readFile(targetFilePath, "utf-8", (err, data) => {
        if (err) {
            handleError(err);
        }

        let targetData = data;
        fs.readFile(localFilePath, "utf-8", (err, data) => {
            if (err) {
            }

            const localData = data;
            targetData = localData;

            fs.writeFile(targetFilePath, targetData, (err) => {
                if (err) {
                    handleError(err);
                }
            });
        });
    });
}

export async function copyFile(localFilePath: string, targetFilePath: string) {
    fs.copyFile(localFilePath, targetFilePath, (err) => {
        if (err) {
            handleError(err);
        }
    });
}

export async function appendFile(targetFilePath: string, appendData: string) {
    fs.appendFile(targetFilePath, appendData, (err) => {
        if (err) {
            handleError(err);
        }
    });
}
