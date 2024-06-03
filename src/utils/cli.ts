// Import necessary external Module(s)
import { Command, Option } from "commander";
import { blue, green, lightRed, magenta, red, yellow } from "kolorist";
import prompts from "prompts";

// Import necessary Type(s)
import type { T_UserInput } from "../types/prompt";

type T_ColorFunc = (str: string | number) => string;
type T_Framework = {
    name: string;
    display: string;
    color?: T_ColorFunc;
    variants: T_FrameworkVariant[];
};
type T_FrameworkVariant = {
    name: string;
    display: string;
    color: T_ColorFunc;
    description: string;
    customCommand?: string;
};
type T_Options = {
    name: string;
    display: string;
    color: T_ColorFunc;
    description: string;
};

const frameworks: T_Framework[] = [
    {
        name: "express",
        display: "Express",
        variants: [
            {
                name: "express/js",
                display: "Express",
                color: yellow,
                description: "Includes JavaScript.",
            },
            {
                name: "express/ts",
                display: "Express + TypeScript",
                color: blue,
                description: "Includes TypeScript.",
            },
        ],
    },
];

export const templates: ReadonlyArray<T_FrameworkVariant> = frameworks
    .map((f: T_Framework) => {
        return f.variants.map((v: T_FrameworkVariant) => {
            return v;
        });
    })
    .reduce((a, b) => a.concat(b), []);

export const formatterAndLinters: T_Options[] = [
    {
        name: "eslint-prettier",
        display: "EsLint + Prettier",
        color: magenta,
        description: "Includes EsLint as linter & Prettier as Formatter.",
    },
    {
        name: "biome-prettier",
        display: "Biome + Prettier",
        color: blue,
        description:
            "Includes Biome for linting/formatting and Prettier for other files.",
    },
];

export const orms: T_Options[] = [
    {
        name: "prisma",
        display: "Relational Db + Prisma",
        color: blue,
        description: "Includes Prisma ORM.",
    },
    {
        name: "mongoose",
        display: "Non-Relational Db + mongoose",
        color: green,
        description: "Includes mongoose OEM.",
    },
];

const defaultDirName = "node-nitro-app";

export function parseArgs() {
    const program = new Command();

    program
        .addOption(
            new Option("-t, --template <string>", "template name").choices(
                templates.map((t: T_FrameworkVariant) => t.name),
            ),
        )
        .addOption(
            new Option(
                "-d, --dir [string]",
                "name of the project directory",
            ).preset(defaultDirName),
        )
        .action((options) => {
            if (options.dir) {
                if (!options.template) {
                    console.log(
                        "error: required option '-t, --template <string>' not specified",
                    );
                    process.exit(1);
                }
            }
        })
        .parse(process.argv);

    const userArgs = program.opts();

    if (!userArgs.template && !userArgs.dir) {
        return null;
    }

    const userInput: T_UserInput = {
        type: "args",
        template: userArgs.template,
        dirName: userArgs.dir,
    };

    return userInput;
}

export async function startUserInteraction() {
    const uInput = await prompts(
        [
            {
                type: "select",
                name: "ucTemplate",
                message: "Choose your desired template",
                choices: templates.map((t: T_FrameworkVariant) => {
                    const outputColor = t.color;
                    return {
                        title: outputColor(t.display),
                        value: t.name,
                        description: t.description,
                    };
                }),
            },
            {
                type: "text",
                name: "ucDirName",
                message: "Enter name for project directory",
                initial: defaultDirName,
            },
            {
                type: "select",
                name: "ucFormatterAndLinter",
                message: "Choose your desired formatter and linter combo",
                choices: formatterAndLinters.map((fl: T_Options) => {
                    const outputColor = fl.color;

                    const displaySplit = fl.display
                        .split("+")
                        .map((s: string) => s.trim());

                    return {
                        title: `${outputColor(displaySplit[0])}${lightRed(
                            ` + ${displaySplit[1]}`,
                        )}`,
                        value: fl.name,
                        description: fl.description,
                    };
                }),
            },
            {
                type: "toggle",
                name: "ucWantDb",
                message: "Do you want to connect to db",
                active: "yes",
                inactive: "no",
            },
            {
                type: (prev) => (prev ? "select" : null),
                name: "ucORM",
                message: "Choose your desired OEM/ORM",
                choices: orms.map((orm: T_Options) => {
                    const outputColor = orm.color;

                    return {
                        title: outputColor(orm.display),
                        value: orm.name,
                        description: orm.description,
                    };
                }),
            },
            {
                type: (prev) => (prev ? "invisible" : null),
                name: "ucDsn",
                message: "Enter your connection string",
                validate(value) {
                    if (value === "") {
                        return "Connection string cannot be empty!";
                    }

                    return true;
                },
            },
        ],
        {
            onCancel() {
                console.log(`\n${red("Program stopped")}\nReason -: Keyboard interupt.`);
                process.exit(1);
            },
        },
    );

    const userInput: T_UserInput = {
        type: "cli",
        template: uInput.ucTemplate,
        dirName: uInput.ucDirName,
        formatterAndLinter: uInput.ucFormatterAndLinter,
        wantDb: uInput.ucWantDb,
        orm: uInput.ucORM,
        dsn: uInput.ucDsn,
    };

    return userInput;
}
