import {DefaultLintConfig} from '@ryanemcdaniel/eslint-config';
import licenseHeader from 'eslint-plugin-license-header';

export default [
  ...DefaultLintConfig,
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      'license-header': licenseHeader
    },
  }
];
