import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

module.exports = [
    eslintPluginPrettierRecommended,
    {
        env: {
            browser: true,
            es2021: true,
        },
        extends: 'eslint:recommended',
        parserOptions: {
            ecmaVersion: 12,
            sourceType: 'module',
        },
        rules: {},
        ignorePatterns: [],
        overrides: [
            {
                files: ['**/*.ts', '**/*.tsx'],
                parser: '@typescript-eslint/parser',
                extends: [
                    'eslint:recommended',
                    'plugin:@typescript-eslint/recommended',
                    'plugin:prettier/recommended',
                ],
                rules: {},
            },
        ],
    },
];
