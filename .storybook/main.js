const path = require("path");

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-scss",
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5",
  },
  "webpackFinal": async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@atoms": path.resolve(__dirname, "../src/components/atoms"),
      "@molecules": path.resolve(__dirname, "../src/components/molecules"),
      "@organisms": path.resolve(__dirname, "../src/components/organisms"),
      "@templates": path.resolve(__dirname, "../src/components/templates"),
      "@utils": path.resolve(__dirname, "../src/utils"),
      "@styles": path.resolve(__dirname, "../src/styles"),
    };
    return config;
  },
};
