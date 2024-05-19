import type { T_UserInputCli } from "./prompt";

export type T_Arg_HandleArgs = {
    installCmd: string;
    targetPath: string;
};

export type T_Arg_HandleCli = {
    userInput: T_UserInputCli;
    dependencyCmd: string;
    devDependencyCmd: string;
    targetPath: string;
};
