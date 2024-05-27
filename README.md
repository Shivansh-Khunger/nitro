# create-node-nitro <a href="https://www.npmjs.com/package/create-node-nitro"><img src="https://img.shields.io/npm/v/create-node-nitro" alt="npm package"></a>

## Scaffolding Your Node API's

> **Compatibility Note:**
> Vite requires [Node.js](https://nodejs.org/en/) version 18+, 20+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.

### Features

-   **Templates**: Quick setup for Node APIs with industry-standard templates.
-   **Database Support**: Easy integration with popular databases.
-   **ORM Support**: Support for ORMs like Mongoose and Prisma for easier database operations.
-   **Linter Support**: Includes linters like ESLint and Biome for cleaner, consistent code.

With NPM:

```bash
$ npm create node-nitro@latest
```

Then follow the prompts!

You can also directly specify the project name and the template you want to use via additional command line options. For example, to scaffold a project, run:

```bash
# npm 7+, extra double-dash is needed:
npm create node-nitro@latest -- -t <template name> -d <directory name>
```

Currently supported template presets include:

-   `express/js`
-   `express/ts`

Note: For additional options, you would have to use the normal command mentioned prior.
