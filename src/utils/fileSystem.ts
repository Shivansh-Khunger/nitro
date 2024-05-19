import fs from "node:fs";

export function deleteFile(targetFilePath: string) {
    fs.unlink(targetFilePath, (err) => {
        // TODO -> handle errors
    });
}

export async function updateFile(
    localFilePath: string,
    targetFilePath: string,
) {
    fs.readFile(targetFilePath, "utf-8", (err, data) => {
        if (err) {
            // TODO -> handle errors
        }

        let targetData = data;
        fs.readFile(localFilePath, "utf-8", (err, data) => {
            if (err) {
            }

            const localData = data;
            targetData = localData;

            fs.writeFile(targetFilePath, targetData, (err) => {
                if (err) {
                    // TODO -> handle errors
                }
            });
        });
    });
}

export async function copyFile(localFilePath: string, targetFilePath: string) {
    fs.copyFile(localFilePath, targetFilePath, (err) => {
        if (err) {
            // TODO -> handle errors
        }
    });
}

export async function appendFile(targetFilePath: string, appendData: string) {
    fs.appendFile(targetFilePath, appendData, (err) => {
        if (err) {
            // TODO -> handle errors
        }
    });
}
