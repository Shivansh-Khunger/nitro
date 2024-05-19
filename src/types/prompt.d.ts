declare const templateNames: readonly ["express/js", "express/ts"];
declare const formatAndLinters: readonly ["eslint-prettier", "biome-prettier"];
declare const orms: readonly ["prisma", "mongoose"];

export type T_TemplateNames = (typeof templateNames)[number];
export type T_FormatAndLinters = (typeof formatAndLinters)[number];
export type T_Orms = (typeof orms)[number];

export type T_UserInputArgs = {
    type: "args";
    template: T_TemplateNames;
    dirName: string;
};

export type T_UserInputCli = {
    type: "cli";
    template: T_TemplateNames;
    dirName: string;
    formatterAndLinter: T_FormatAndLinters;
    wantDb: boolean;
    orm: T_Orms;
    dsn: string;
};

export type T_UserInput = T_UserInputArgs | T_UserInputCli;
