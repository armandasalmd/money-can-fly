import "@styles/Global.scss";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    current: "light",
    darkClass: "theme--dark",
    lightClass: "theme--light",
    stylePreview: true,
  },
  backgrounds: {
    disable: true,
  },
};
