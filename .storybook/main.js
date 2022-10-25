const path = require("path");

module.exports = {
  "stories": [
    "../src/components/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-scss",
    {
      name: "@storybook/preset-typescript",
      options: {
        tsLoaderOptions: {
          configFile: path.resolve(__dirname, "../tsconfig.json"),
        },
        include: [path.resolve(__dirname, "../src")],
      },
    },
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5",
  },
  "staticDirs": [
    "../public",
  ],
  webpackFinal: async (config, { configType }) => {
    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss$/,
      loader: "sass-loader",
      options: {
        log: console.log(
          '\n\n\n\npath.resolve(__dirname, "src/styles/")',
          path.resolve(__dirname, "../src/styles"),
        ),
        includePaths: [path.resolve(__dirname, "src/styles")],
      },
    });

    // Return the altered config
    return config;
  },
};
