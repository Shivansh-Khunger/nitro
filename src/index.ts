// Import necessary node Module(s)
import { execSync } from "node:child_process";
import fs from "node:fs";
import { Worker } from "node:worker_threads";

// Import necessary Module(s)
import addDbAndOrm from "@helpers/db&Orms";
import { makeDevEnv, makeProdEnv } from "@helpers/envMaker";
import addFmtAndLinterConfig from "@helpers/fmt&Linters";
import handleAdditionalOptions from "@helpers/handleOptions";
import printDependencies from "@helpers/printDependencies";
import { parseArgs, startUserInteraction } from "@utils/cli";
import handleError, { makeTargetPath } from "@utils/errorHandler";

// Import necessary Type(s)
import type {
    T_Arg_HandleArgs,
    T_Arg_HandleCli,
} from "./types/dependencyInstallers";
import type { T_UserInput } from "./types/prompt";

let filePathArr: string[];
export let projectDirPath: string;

if (process.platform === "win32") {
    filePathArr = __dirname.split("\\");
    filePathArr.pop();
    projectDirPath = filePathArr.join("\\");
} else {
    filePathArr = __dirname.split("/");
    filePathArr.pop();
    projectDirPath = filePathArr.join("/");
}

(async () => {
    const parsedArgs = parseArgs();

    if (!parsedArgs) {
        const userInputCli = await startUserInteraction();

        handleLogic(userInputCli);
    } else {
        handleLogic(parsedArgs);
    }
})();

function copyTemplate(targetPath: string, targetTemplate: string) {
    try {
        const templatePath = `${projectDirPath}/templates/${targetTemplate}`;

        fs.cpSync(templatePath, targetPath, { recursive: true });
    } catch (err) {
        handleError(err);
    }
}

function intialiseGitRepo(targetPath: string) {
    const intialiseCmd = "git init";

    try {
        execSync(intialiseCmd, { cwd: targetPath });
    } catch (err) {
        handleError(err);
    }
}

function installDependecies(targetPath: string, userInput: T_UserInput) {
    const dependencyCmd = "npm i express pino pino-http pino-pretty";
    let devDependencyCmd: string;

    function handleArgs({
        dependencyCmd,
        devDependencyCmd,
        targetPath,
    }: T_Arg_HandleArgs) {
        const installCmd = `${dependencyCmd} && ${devDependencyCmd}`;
        try {
            execSync(installCmd, {
                cwd: targetPath,
            });
        } catch (err) {
            handleError(err);
        }
    }

    function handleCli({
        userInput,
        dependencyCmd,
        devDependencyCmd,
        targetPath,
    }: T_Arg_HandleCli) {
        const installCmd = handleAdditionalOptions(
            userInput,
            dependencyCmd,
            devDependencyCmd,
        );

        addFmtAndLinterConfig(
            userInput.formatterAndLinter,
            targetPath,
            projectDirPath,
        );

        try {
            execSync(installCmd, {
                cwd: targetPath,
                stdio: "inherit",
            });
        } catch (err) {
            handleError(err);
        }

        if (userInput.wantDb) {
            addDbAndOrm(userInput, projectDirPath, targetPath);
        }
    }

    switch (userInput.template) {
        case "express/js":
            {
                devDependencyCmd = "npm i --save-dev @dotenvx/dotenvx nodemon";

                if (userInput.type === "args") {
                    handleArgs({ dependencyCmd, devDependencyCmd, targetPath });
                } else {
                    handleCli({
                        userInput,
                        dependencyCmd,
                        devDependencyCmd,
                        targetPath,
                    });
                }
            }
            break;
        case "express/ts":
            {
                devDependencyCmd =
                    "npm i --save-dev tsx typescript @dotenvx/dotenvx @types/express @types/node";

                if (userInput.type === "args") {
                    handleArgs({ dependencyCmd, devDependencyCmd, targetPath });
                } else {
                    handleCli({
                        userInput,
                        dependencyCmd,
                        devDependencyCmd,
                        targetPath,
                    });
                }
            }
            break;
        default:
            break;
    }
}

function handleLogic(userInput: T_UserInput) {
    const targetPath = makeTargetPath(userInput.dirName);

    copyTemplate(targetPath, userInput.template);

    makeDevEnv(targetPath);
    makeProdEnv(targetPath);

    intialiseGitRepo(targetPath);
    installDependecies(targetPath, userInput);
}
