module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jest/globals": true
    },
    "extends": ["eslint:recommended", "airbnb"],
    "parser": "babel-eslint",
    "parserOptions": {
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "jest"
    ],
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": [".js", ".jsx"]
            },
        }
    },
    "rules": {
        "arrow-parens": ["error", "always"],
        "react/forbid-prop-types": "off",
        "no-plusplus": "off",
        "no-nested-ternary": "off",
    }
};
