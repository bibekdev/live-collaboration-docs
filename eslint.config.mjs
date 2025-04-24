import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
import { defineConfig } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  {
    extends: compat.extends('next/core-web-vitals', 'next/typescript'),

    plugins: {
      perfectionist
    },

    rules: {
      'no-unused-vars': 'off',
      'no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',

          fallbackSort: {
            type: 'unsorted'
          },

          ignoreCase: true,
          specialCharacters: 'keep',
          internalPattern: ['^@/.+'],
          partitionByComment: false,
          partitionByNewLine: false,
          newlinesBetween: 'never',

          groups: [
            'next',
            'react',
            ['builtin', 'external'],
            {
              newlinesBetween: 'always'
            },
            'internal',
            'parent',
            'sibling',
            'index'
          ],

          customGroups: {
            type: {
              react: '^react$',
              next: '^next$'
            },

            value: {
              react: ['^react$', '^react-.+'],
              next: ['^next$', '^next/.+']
            }
          }
        }
      ]
    }
  }
]);
