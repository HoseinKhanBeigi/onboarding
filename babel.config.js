module.exports = {
  presets: ['next/babel'],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    ['import', { libraryName: 'antd', style: true }],
    ['@babel/plugin-transform-typescript', { allowNamespaces: true }],
  ],
};
