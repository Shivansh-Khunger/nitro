// Import necessary node Module(s)
import { execSync } from "node:child_process";
import { workerData } from "node:worker_threads";

// Import necessary Module(s)
import handleError from "./errorHandler";

function installDependenciesInBackground(
    installCmd: string,
    targetPath: string,
) {
    try {
        execSync(installCmd, { cwd: targetPath });
    } catch (err) {
        handleError(err);
    }
}

installDependenciesInBackground(workerData.installCmd, workerData.targetPath);
