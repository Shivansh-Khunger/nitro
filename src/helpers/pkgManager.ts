function pkgFromUserAgent(userAgent: string | undefined) {
    if (!userAgent) return undefined;
    const pkgSpec = userAgent.split(" ")[0];
    const pkgSpecArr = pkgSpec.split("/");
    return {
        name: pkgSpecArr[0],
        version: pkgSpecArr[1],
    };
}

export type T_PkgManagerInfo = {
    pkgManager: string;
    prefix: string;
    devPrefix: string;
};

const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
const pkgManager = pkgInfo ? pkgInfo.name : "npm";

function selectPkgManager(): T_PkgManagerInfo {
    let pkgManagerInfo: T_PkgManagerInfo = {
        pkgManager: pkgManager,
        prefix: "npm i",
        devPrefix: "npm i --save-dev",
    };

    if (pkgManager === "yarn") {
        pkgManagerInfo = {
            ...pkgManagerInfo,
            prefix: "yarn add",
            devPrefix: "yarn add --dev",
        };

        return pkgManagerInfo;
    }
    if (pkgManager === "pnpm") {
        pkgManagerInfo = {
            ...pkgManagerInfo,
            prefix: "pnpm add",
            devPrefix: "pnpm add --save-dev",
        };

        return pkgManagerInfo;
    }

    return pkgManagerInfo;
}

export default selectPkgManager;
