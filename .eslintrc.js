/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// ESLint configuration
// http://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'plugin:css-modules/recommended',
    'prettier',
    'prettier/flowtype',
    'prettier/react',
  ],

  plugins: ['@typescript-eslint', 'css-modules', 'prettier', 'cypress', 'react-hooks'],

  env: {
    browser: true,
    'cypress/globals': true,
    "jest": true
  },

  rules: {
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "off", // Checks effect dependencies
    "@typescript-eslint/ban-ts-ignore": "off",
    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': ['error', {packageDir: '.'}],

    "no-unused-vars": "warn",
    "camelcase": "warn",
    "no-template-curly-in-string": "warn",
    "no-unused-expressions": "off",
    "react/destructuring-assignment": "off",
    "no-else-return": "off",
    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    // https://eslint.org/docs/rules/no-console
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'no-plusplus': 'off',
    'no-restricted-syntax': 'warn',
    'no-restricted-globals': 'warn',
    'no-prototype-builtins': 'warn',
    'no-param-reassign': 'warn',
    '@typescript-eslint/camelcase': 'warn',
    'no-await-in-loop': 'warn',

    'class-methods-use-this': 'off',
    'css-modules/no-undef-class': 'off',

    'import/no-unresolved': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'no-inner-declarations': 'off',
    'consistent-return': 'warn',
    'import/prefer-default-export': 'warn',

    // Allow only special identifiers
    // https://eslint.org/docs/rules/no-underscore-dangle
    'no-underscore-dangle': [
      'error',
      {
        allow: ['__typename'],
      },
    ],

    'no-use-before-define': ["error", { "functions": false, "classes": false }],
    '@typescript-eslint/no-use-before-define': ["error", { "functions": false, "classes": false }],
    'no-dupe-class-members': ["warn"],
    '@typescript-eslint/triple-slash-reference': ["warn"],
    'import/no-cycle': ["off"],
    'no-useless-escape': "off",
    '@typescript-eslint/no-empty-function': "warn",
    'css-modules/no-unused-class': "warn",
    'jsx-a11y/click-events-have-key-events': "off",
    'jsx-a11y/no-static-element-interactions': "off",
    'react/no-unescaped-entities': "off",

    // Prefer destructuring from arrays and objects
    // http://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // Ensure <a> tags are valid
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    "jsx-a11y/anchor-is-valid": "off",

    // Allow .js files to use JSX syntax
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    'react/jsx-filename-extension': ['error', {extensions: ['.js', '.jsx', '.ts', '.tsx']}],

    // Functional and class components are equivalent from React’s point of view
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    'react/prefer-stateless-function': 'off',

    'react/forbid-prop-types': 'off',

    // ESLint plugin for prettier formatting
    // https://github.com/prettier/eslint-plugin-prettier
    "prettier/prettier": ["error", {"singleQuote": true, trailingComma: 'all'}],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ]
  },

    settings: {
        // Allow absolute paths in imports, e.g. import Button from 'components/Button'
        // https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers
        'import/resolver': {
            node: {
                moduleDirectory: ['node_modules', 'src'],
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        },
        "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
        }
    },
};
