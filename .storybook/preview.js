import "!style-loader!css-loader!sass-loader!../src/styles/Global.scss";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    darkClass: 'theme theme--dark',
    lightClass: 'theme theme--light',
    stylePreview: true,
  },
}