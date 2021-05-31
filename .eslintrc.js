module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
    parserOptions: {
        parser: "babel-eslint"
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        quotes: ["warn", "single"],
        semi: ["warn", "never"],
        indent: ["warn", 4],
        "max-len": [
            "warn",
            {
                code: 120,
                tabWidth: 4,
                ignoreUrls: true
            }
        ]
    }
}
