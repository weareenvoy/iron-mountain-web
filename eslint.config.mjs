import cspellPlugin from '@cspell/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import turbo from 'eslint-plugin-turbo';
import globals from 'globals';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const __dirname = import.meta.dirname;

const eslintConfig = defineConfig([
  // Next's flat preset (includes plugin + rules, Core Web Vitals)
  ...nextVitals,
  ...nextTs,
  perfectionist.configs['recommended-natural'],
  // Prettier at the end to neutralize stylistic rules
  prettier,

  // Add any environment globals (e.g. service workers used by Next)
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        AppRoutes: 'readonly',
        LayoutProps: 'readonly',
        PageProps: 'readonly',
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    settings: { react: { version: 'detect' } },
  },

  // Ensure public SW is linted without project service errors
  {
    files: ['public/sw.js'],
    languageOptions: {
      parserOptions: {
        projectService: false,
      },
    },
  },

  {
    plugins: {
      '@cspell': cspellPlugin,
      'import': importPlugin,
      'prettier': prettierPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'turbo': turbo,
    },
    rules: {
      // cspell (points at your repo-level config)
      '@cspell/spellchecker': ['warn', { autoFix: true, cspell: require('./cspell.config.cjs') }],
      '@next/next/no-img-element': 'warn',
      '@typescript-eslint/member-ordering': ['error', { default: { order: 'alphabetically' } }],
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-conversion': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off', // TODO: Change to error
      '@typescript-eslint/triple-slash-reference': 'off',
      // Flag class methods that don't use 'this', promoting simpler functions.
      'class-methods-use-this': 'error',
      'comma-dangle': ['error', 'only-multiline'],
      'import/consistent-type-specifier-style': 'off',
      'import/exports-last': 'off',
      'import/group-exports': 'off',
      'import/max-dependencies': 'off',
      'import/no-anonymous-default-export': 'warn',
      'import/no-default-export': 'off',
      'import/no-duplicates': 'error',
      'import/no-internal-modules': 'off',
      'import/no-named-export': 'off',
      'import/no-nodejs-modules': [
        'error',
        {
          allow: ['node:assert/strict', 'node:fs/promises', 'node:path', 'node:url', 'node:module'],
        },
      ],
      'import/no-relative-parent-imports': 'off',
      'import/no-unassigned-import': 'off',
      'import/no-unresolved': 'off', // TS resolver handles this
      'import/order': ['off'], // perfectionist/sort-imports handles this
      'import/prefer-default-export': 'off',
      'no-console': ['error', { allow: ['error', 'info', 'warn'] }],
      'no-duplicate-imports': 'error',
      // Discourage 'new' keyword for side effects.
      'no-new': 'error',
      // Restrict extending other classes via inheritance.
      'no-restricted-syntax': [
        'error',
        {
          message: 'Use composition instead of inheritance.',
          selector: 'ClassDeclaration[superClass]',
        },
      ],
      'no-undef': 'off',
      'no-unsafe-optional-chaining': 'error',
      'one-var': ['error', 'never'],
      // 1. Line Ordering (Matches import/order logic)
      'perfectionist/sort-imports': [
        'error',
        {
          // groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          groups: [
            ['value-builtin', 'value-external'],
            'value-internal',
            ['value-parent', 'value-sibling', 'value-index'],
            ['type-parent', 'type-sibling', 'type-index'],
            'ts-equals-import',
            'type-internal',
            'type-import',
            'unknown',
          ],
          ignoreCase: false,
          newlinesBetween: 0,
          order: 'asc',
          specialCharacters: 'remove',
        },
      ],
      'perfectionist/sort-modules': ['error', { order: 'asc', type: 'unsorted' }],
      // 2. Specifier Sorting (Matches named: { enabled: true } logic)
      'perfectionist/sort-named-imports': [
        'error',
        {
          groups: ['value-import', 'type-import'],
          ignoreCase: false,
          newlinesBetween: 0,
          order: 'asc',
        },
      ],
      'prefer-const': 'error',
      'prefer-destructuring': 'off',
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          bracketSameLine: false,
          bracketSpacing: true,
          experimentalTernaries: false,
          plugins: ['prettier-plugin-tailwindcss'],
          printWidth: 120,
          proseWrap: 'always',
          quoteProps: 'consistent',
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          tailwindFunctions: ['clsx'],
          tailwindPreserveWhitespace: true,
          tailwindStylesheet: resolve(__dirname, './src/lib/tailwind/styles/globals.css'),
          trailingComma: 'es5',
          useTabs: false,
        },
      ],
      'quotes': ['error', 'single', { allowTemplateLiterals: false, avoidEscape: true }],
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react/display-name': 'off',
      // Standardize how functional components are defined.
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-curly-brace-presence': ['error', { children: 'never', propElementValues: 'always', props: 'never' }],
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'react/jsx-no-bind': [
        'error',
        {
          allowArrowFunctions: false,
          allowBind: false,
          allowFunctions: false,
        },
      ],
      'react/jsx-pascal-case': ['warn', { allowNamespace: true }],
      'react/jsx-sort-props': 'error',
      // Disallow nesting components inside other components.
      // This helps prevent state loss and readability issues.
      'react/no-unstable-nested-components': 'error',
      'react/prefer-read-only-props': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react/sort-comp': 'error',
      'react/sort-default-props': 'error',
      'react/sort-prop-types': 'error',
      'sort-imports': ['error', { ignoreDeclarationSort: true, ignoreMemberSort: true }], // perfectionist/sort-named-imports handles member sorting
      'sort-keys': ['off'],
      'sort-vars': 'error',
      'space-before-function-paren': ['error', { anonymous: 'always', asyncArrow: 'always', named: 'never' }],
      // Turborepo
      'turbo/no-undeclared-env-vars': 'warn',
    },
    settings: {
      // Make import plugin TypeScript-aware + support "@/..."
      'import/resolver': {
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        typescript: {
          // respects tsconfig paths across the monorepo
          alwaysTryTypes: true,
          project: true,
        },
      },
      'react': { version: 'detect' },
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/sw.js',
  ]),
]);

export default eslintConfig;
