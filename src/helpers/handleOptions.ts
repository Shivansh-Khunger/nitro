import { bgCyan } from "kolorist";
import type { T_UserInputCli } from "../types/prompt";

// export type T_ReturnHandleOptions = {
//     dependencyCmd: string;
//     devDependencyCmd: string;
// };

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
            devDependency = `${devDependency} @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-prettier`;
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

    console.log(bgCyan(installCmd));

    return installCmd;
}

export default handleAdditionalOptions;
