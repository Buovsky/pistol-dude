module.exports = {
    "env": {
        browser: true,
        commonjs: true,
        es6: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 2018,
    },
    plugins: [
        "@typescript-eslint"
    ],
    rules: {
        indent: ["warn", 4],
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["error"]
    }
}