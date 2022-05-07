/* eslint-disable global-require */
module.exports = () => ({
  plugins: [
    // https://github.com/postcss/postcss-custom-media
    require('postcss-custom-media')(),
    // https://github.com/postcss/postcss-color-function
    require('postcss-color-function')(),
    // https://github.com/postcss/autoprefixer
    require('autoprefixer')({ flexbox: 'no-2009' }),
  ],
});
