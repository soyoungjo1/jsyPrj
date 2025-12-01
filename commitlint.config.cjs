// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^([^a-zA-Z0-9]+)?(\w*)(?:\((.*)\))?: (.+)$/,
      headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
    },
  },
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'ci',
        'chore',
        'docs',
        'ticket',
        'feat',
        'fix',
        'hotfix',
        'perf',
        'refactor',
        'revert',
        'style',
      ],
    ],
    'subject-empty': [0],
  },
};
