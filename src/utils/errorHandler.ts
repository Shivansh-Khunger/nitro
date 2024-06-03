import fs from "node:fs";

// Import necessary Module(s)
import { bold, green, lightRed } from "kolorist";

const cwd = process.cwd();
let targetPath: string;
export function makeTargetPath(userInputDirName: string) {
    targetPath = `${cwd}${
        process.platform === "win32" ? "\\" : "/"
    }${userInputDirName}`;

    return targetPath;
}

function rollBack() {
    try {
        fs.rmSync(targetPath, { recursive: true, force: true });
        console.log(`
            ${bold(
                green(
                    "\nNo need to worry, we have rolled back anything that was done. Try Again!",
                ),
            )}\nIf the error presists report on https://github.com/Shivansh-Khunger/node-nitro`);
    } catch (err) {
        console.log(
            lightRed(
                "\nAn Error has occured while rolling back changes...\nWe recommend manually deleting the project directory.",
            ),
        );
    }

    process.exit(1);
}

// biome-ignore lint/suspicious/noExplicitAny: <errors can be of any type>
function handleError(err: any) {
    console.log(
        lightRed("An Error has occured while setting up your project..."),
    );

    console.log(err);

    rollBack();
}

export default handleError;
