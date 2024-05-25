import type { T_UserInputCli } from "./prompt";

export type T_Arg_HandleArgs = {
    dependencyCmd: string;
    devDependencyCmd: string;
    targetPath: string;
};

export interface T_Arg_HandleCli extends T_Arg_HandleArgs {
    userInput: T_UserInputCli;
}
