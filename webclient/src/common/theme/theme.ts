import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import { darken, lighten } from "polished";

export const spacingUnit = 16;

export const palette = {
  pink: {
    main: "#ff40b4",
    light: lighten(0.05, "#ff40b4"),
    dark: darken(0.05, "#ff40b4"),
  },
};

const overrides = createMuiTheme({
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
    warning: {
      light: lighten(0.05, "#ffb74d"),
      main: "#ffb74d",
      dark: darken(0.05, "#ffb74d"),
    },
    secondary: {
      light: lighten(0.05, "#231F20"),
      main: "#231F20",
      dark: darken(0.05, "#231F20"),
    },
  },
  typography: {
    fontFamily: "'Nunito Sans', sans-serif",
    fontWeightBold: 900,
    h5: {
      fontWeight: 900,
    },
    overline: {
      fontWeight: 900,
    },
    subtitle2: {
      fontSize: "1.1rem",
    },
  },
  overrides: {
    MuiCardContent: {
      root: {
        "&:last-child": {
          paddingBottom: 16,
        },
      },
    },
    MuiInputLabel: {
      root: {
        "&.Mui-focused": {
          color: "rgba(0, 0, 0, 0.87)",
        },
      },
    },
    MuiButton: {
      root: {
        fontWeight: 600,
      },
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

export const theme = responsiveFontSizes(overrides, { factor: 3 });
