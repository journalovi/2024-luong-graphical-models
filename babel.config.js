module.exports = {
  plugins: [
    ['babel-plugin-styled-components'],
    ['@babel/plugin-proposal-class-properties'],
  ],
  assumptions: {
    setPublicClassFields: false,
  },
}
