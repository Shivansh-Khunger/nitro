// Import necessary node Module(s)
import fs from "node:fs";

// Import necessary Module(s)
import { lightRed } from "kolorist";

// Import necessary Type(s)
import type { T_UserInput } from "../types/prompt";

const cwd = process.cwd();
let targetPath: string;
export function makeTargetPath(userInput: T_UserInput) {
    targetPath = `${cwd}/${userInput.dirName}`;

    return targetPath;
}

export async function rollBack() {
    fs.rmdir(targetPath, (err) => {
        if (err) {
            console.log(err);

            console.log(
                lightRed(
                    "An Error has occured while rolling back...\n We recommend you to manually delete the project directory.",
                ),
            );

            process.exit(1);
        }
    });

    process.exit(1);
}

// biome-ignore lint/suspicious/noExplicitAny: <errors can be of any type>
function handleError(err: any) {
    console.log(err);

    console.log(
        lightRed(
            "An Error has occured while setting up your project...\nWe have undone any changes the script made",
        ),
    );

    rollBack();
}

export default handleError;
