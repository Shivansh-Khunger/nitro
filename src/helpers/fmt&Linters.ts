import fs from "node:fs";

import type { T_FormatAndLinters } from "../types/prompt";

import { updateFile } from "@utils/fileSystem";

async function addFmtAndLinterConfig(
    fmtAndLinter: T_FormatAndLinters,
    targetPath: string,
    projectDirPath: string,
) {
    const optionsDirPath = `${projectDirPath}/options`;
    const localConfigPath = `${optionsDirPath}/${fmtAndLinter}/extensions.json`;
    const targetConfigPath = `${targetPath}/.vscode/extensions.json`;
    switch (fmtAndLinter) {
        case "biome-prettier":
            {
                const biomeConfig = "biome.json";
                const localBiomeConfigPath = `${optionsDirPath}/${fmtAndLinter}/${biomeConfig}`;
                const targetBiomeConfigPath = `${targetPath}/${biomeConfig}`;
                fs.copyFile(
                    localBiomeConfigPath,
                    targetBiomeConfigPath,
                    (err) => {
                        // TODO -> handle errors
                    },
                );
            }

            break;
        case "eslint-prettier":
            {
                const esLintConfig = "eslint.config.js";
                const localEsLintConfigPath = `${optionsDirPath}/${fmtAndLinter}/${esLintConfig}`;
                const targetEsLintConfigPath = `${targetPath}/${esLintConfig}`;
                fs.copyFile(
                    localEsLintConfigPath,
                    targetEsLintConfigPath,
                    (err) => {
                        // TODO -> handle errors
                    },
                );
            }

            break;
        default:
            break;
    }
    updateFile(localConfigPath, targetConfigPath);
}

export default addFmtAndLinterConfig;
