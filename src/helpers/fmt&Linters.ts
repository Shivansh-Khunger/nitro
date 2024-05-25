// Import necessary Type(s)
import type { T_FormatAndLinters } from "../types/prompt";

// Import necessary Module(s)
import { updateFile } from "@utils/fileSystem";
import { copyFile } from "@utils/fileSystem";

function addFmtAndLinterConfig(
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

                copyFile(localBiomeConfigPath, targetBiomeConfigPath);
            }

            break;
        case "eslint-prettier":
            {
                const esLintConfig = "eslint.config.js";
                const localEsLintConfigPath = `${optionsDirPath}/${fmtAndLinter}/${esLintConfig}`;
                const targetEsLintConfigPath = `${targetPath}/${esLintConfig}`;

                copyFile(localEsLintConfigPath, targetEsLintConfigPath);
            }

            break;
        default:
            break;
    }
    updateFile(localConfigPath, targetConfigPath);
}

export default addFmtAndLinterConfig;
