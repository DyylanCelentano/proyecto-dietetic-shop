module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['src/backend/**/*.js'],
      extends: './src/backend/.eslintrc.json',
    },
    {
      files: ['src/**/*.jsx', 'src/**/*.js'],
      extends: './src/.eslintrc.json',
    },
  ],
};
