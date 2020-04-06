
const env = process.env.NODE_ENV || 'development';

const envConfig = require(`./${env}/index`).default;
const baseConfig = {
  errorMessages: {
    unknownProvider: provider => `no ${provider} provider found`,
    noHandler: provider => `provider ${ provider } has no handler`,
    noManifest: provider => `provider ${ provider } has no manifest`,
    unknownCommand: (provider, command) => `provider ${ provider } doesn't know how to handle command ${ command }`,
  },
};

export default { 
  ...baseConfig,
  ...envConfig,
};
