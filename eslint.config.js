// https://docs.expo.dev/guides/using-eslint/
// ESLint 9 Flat Config format
const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      // Disable import/no-unresolved for packages that are resolved dynamically
      'import/no-unresolved': [
        'error',
        {
          ignore: [
            'server-only', // RSC-only package, resolved at build time
            '@react-navigation/native-stack', // Resolved by React Navigation
          ],
        },
      ],
      // Disable import rules that check for parse errors in imported modules
      'import/namespace': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
    },
  },
];

