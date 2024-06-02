// Import necessary external Module(s)
import { bgCyan, yellow } from "kolorist";

// Import necessary Type(s)
import type { T_UserInputCli } from "../types/prompt";

function handleAdditionalOptions(
    userInput: T_UserInputCli,
    tempDependency: string,
    tempDevDependency: string,
) {
    let dependency = tempDependency;
    let devDependency = `${tempDevDependency} prettier`;

    if (userInput.formatterAndLinter === "biome-prettier") {
        devDependency = `${devDependency} @biomejs/biome`;
    } else {
        devDependency = `${devDependency} eslint`;
        if (userInput.template === "express/ts") {
            devDependency = `${devDependency} @eslint/js @types/eslint__js typescript typescript-eslint eslint-plugin-prettier`;
        }
    }

    if (userInput.wantDb) {
        if (userInput.orm === "mongoose") {
            dependency = `${dependency} mongoose`;
        } else {
            dependency = `${dependency} prisma @prisma/client`;
        }
    }

    const installCmd = `${dependency} && ${devDependency}`;

    console.log(
        `${yellow("Installling dependencies...\ncommand ->")} ${bgCyan(
            ` ${installCmd} `,
        )}`,
    );

    return installCmd;
}

export default handleAdditionalOptions;
