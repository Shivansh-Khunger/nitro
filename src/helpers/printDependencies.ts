import { gray } from "kolorist";

import type { T_PkgManagerInfo } from "./pkgManager";

function printDependencies(
    dependencyCmd: string,
    devDependencyCmd: string,
    pkgManagerInfo: T_PkgManagerInfo,
) {
    if (pkgManagerInfo.pkgManager === "pnpm") {
        // pnpm does this by default
        return;
    }

    const dependencies = dependencyCmd.replace(pkgManagerInfo.prefix, "");
    const devDependencies = devDependencyCmd.replace(
        pkgManagerInfo.devPrefix,
        "",
    );

    const dependenciesArr = dependencies.split(" ");
    const devDependenciesArr = devDependencies.split(" ");

    console.log(
        `\nDownloading dependencies... (${pkgManagerInfo.pkgManager})\n`,
    );

    console.log("Dependencies -:");
    dependenciesArr.map((d: string) => {
        console.log(`${gray(d)}`);
    });

    console.log("\nDev-Dependencies -:");
    devDependenciesArr.map((d: string) => {
        console.log(`${gray(d)}`);
    });

    if (pkgManagerInfo.pkgManager !== "npm") {
        console.log("\n");
    }
}

export default printDependencies;
