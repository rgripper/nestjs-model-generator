module.exports =  {
    parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
    plugins: ['@typescript-eslint'],
    extends:  [
      'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    parserOptions:  {
      ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
      sourceType:  'module',  // Allows for the use of imports
    },
    rules:  {
      '@typescript-eslint/prefer-interface': 'off',
      '@typescript-eslint/class-name-casing': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
      // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    },
  };
  