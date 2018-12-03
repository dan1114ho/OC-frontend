const { createConfig, babel, css } = require('webpack-blocks');
const path = require('path');
const fileExistsCaseInsensitive = require('react-styleguidist/scripts/utils/findFileCaseInsensitive');

module.exports = {
  getExampleFilename(componentPath) {
    const examplePath = path.join(__dirname, 'styleguide', 'examples', `${path.parse(componentPath).name}.md`);
    const existingFile = fileExistsCaseInsensitive(examplePath);
    if (existingFile) {
      return existingFile;
    }
    return false;
  },
  skipComponentsWithoutExample: true,
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'styleguide/ThemeWrapper'),
  },
  usageMode: 'expand',
  webpackConfig: createConfig([babel()]),
};
