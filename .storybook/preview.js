import "@styles/Global.scss";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
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
