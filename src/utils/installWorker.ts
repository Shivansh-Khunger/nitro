import { execSync } from "node:child_process";
import { workerData } from "node:worker_threads";

function installDependenciesInBackground(
    installCmd: string,
    targetPath: string,
) {
    try {
        execSync(installCmd, { cwd: targetPath });
    } catch (err) {
        // TODO -> handle errors
    }
}

installDependenciesInBackground(workerData.installCmd, workerData.targetPath);
