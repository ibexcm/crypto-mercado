import { createMuiTheme } from "@material-ui/core/styles";
import { darken, lighten } from "polished";

export const spacingUnit = 16;

export const palette = {
  pink: {
    main: "#ff40b4",
    light: lighten(0.05, "#ff40b4"),
    dark: darken(0.05, "#ff40b4"),
  },
};

export const theme = createMuiTheme({
  spacing: 8,
  palette: {
    action: {
      active: "#434343",
    },
    background: {
      default: "white",
    },
    primary: {
      light: lighten(0.05, "#044900"),
      main: "#044900",
      dark: darken(0.05, "#044900"),
    },
    secondary: {
      light: lighten(0.05, "#231F20"),
      main: "#231F20",
      dark: darken(0.05, "#231F20"),
    },
  },
  typography: {
    fontFamily: "Montserrat, sans-serif",
    h5: {
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "1.1rem",
    },
  },
  overrides: {
    MuiInputLabel: {
      root: {
        "&.Mui-focused": {
          color: "rgba(0, 0, 0, 0.87)",
        },
      },
    },
    MuiButton: {
      sizeLarge: {
        padding: "12px 22px",
      },
    },
    MuiInput: {
      underline: {
        "&:after": {
          borderBottomColor: "rgba(0, 0, 0, 0.87)",
        },
      },
    },
    MuiAppBar: {
      colorDefault: {
        backgroundColor: "white",
      },
    },
    MuiContainer: {
      root: {
        minHeight: "100vh",
      },
    },
  },
});
