import { themeQuartz } from "ag-grid-community";

export const myQuartzDarkTheme = themeQuartz.withParams({
  accentColor: "#227d54",
  backgroundColor: "#000000",
  browserColorScheme: "dark",
  chromeBackgroundColor: {
    ref: "foregroundColor",
    mix: 0.07,
    onto: "backgroundColor",
  },
  foregroundColor: "#FFF",
  headerFontSize: 14,
  selectedRowBackgroundColor: "#00ff001a",
});

export const myQuartzLightTheme = themeQuartz.withParams({
  accentColor: "#227D54",
  borderColor: "#726F6F26",
  browserColorScheme: "light",
  headerFontSize: 14,
});
