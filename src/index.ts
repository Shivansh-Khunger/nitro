// Import necessary node Module(s)
import { execSync } from "node:child_process";
import fs from "node:fs";

// Import necessary Module(s)
import addDbAndOrm from "@helpers/db&Orms";
import { makeDevEnv, makeProdEnv } from "@helpers/envMaker";
import addFmtAndLinterConfig from "@helpers/fmt&Linters";
import handleAdditionalOptions from "@helpers/handleOptions";
import selectPkgManager from "@helpers/pkgManager";
import printDependencies from "@helpers/printDependencies";
import { parseArgs, startUserInteraction } from "@utils/cli";
import handleError, { makeTargetPath } from "@utils/errorHandler";
import { renameFile } from "@utils/fileSystem";

// Import external Module(s)
import { gray, lightBlue, red } from "kolorist";

// Import necessary Type(s)
import type {
    T_Arg_HandleArgs,
    T_Arg_HandleCli,
} from "./types/dependencyInstallers";
import type { T_UserInput } from "./types/prompt";

const sysPathDisapator = process.platform === "win32" ? "\\" : "/";
const filePathArr = __dirname.split(sysPathDisapator);
filePathArr.pop();
export const projectDirPath = filePathArr.join(sysPathDisapator);

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
        const exists = fs.existsSync(targetPath);

        if (exists) {
            console.log(
                `\n${red(
                    "Program stopped",
                )}\nReason -: A directory with the same name exists.`,
            );
            process.exit(1);
        }

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

function performRenames(targetPath: string) {
    const renameFiles: Record<string, string> = {
        _gitignore: ".gitignore",
    };

    for (const key in renameFiles) {
        renameFile(`${targetPath}/${key}`, `${targetPath}/${renameFiles[key]}`);
    }
}

function installDependecies(targetPath: string, userInput: T_UserInput) {
    const pkgManagerInfo = selectPkgManager();

    const dependencyCmd = `${pkgManagerInfo.prefix} express pino pino-http pino-pretty`;
    let devDependencyCmd = "prettier";

    function handleArgs({
        dependencyCmd,
        devDependencyCmd,
        targetPath,
    }: T_Arg_HandleArgs) {
        const installCmd = `${dependencyCmd} && ${devDependencyCmd}`;

        printDependencies(dependencyCmd, devDependencyCmd, pkgManagerInfo);

        try {
            execSync(installCmd, {
                cwd: targetPath,
                stdio: "inherit",
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
        // these are updated dependency and devDependecy commands which include all the extra options
        const { updtDependencyCmd, updtDevDependencyCmd } =
            handleAdditionalOptions(userInput, dependencyCmd, devDependencyCmd);

        addFmtAndLinterConfig(
            userInput.formatterAndLinter,
            targetPath,
            projectDirPath,
        );

        const installCmd = `${updtDependencyCmd} && ${updtDevDependencyCmd}`;

        printDependencies(
            updtDependencyCmd,
            updtDevDependencyCmd,
            pkgManagerInfo,
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
                devDependencyCmd = `${pkgManagerInfo.devPrefix} ${devDependencyCmd} @dotenvx/dotenvx nodemon`;

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
                devDependencyCmd = `${pkgManagerInfo.devPrefix} ${devDependencyCmd} tsx typescript @dotenvx/dotenvx @types/express @types/node`;

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

    performRenames(targetPath);
    intialiseGitRepo(targetPath);
    installDependecies(targetPath, userInput);

    console.log(
        `\n${lightBlue("Project made at -:")} ${gray(
            `${targetPath},`,
        )} Hope you finish this one ;)`,
    );
}
