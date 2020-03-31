import { Theme } from "@material-ui/core";

export const toolbarHeightDesktop = 98;
export const toolbarHeightMobile = 56;
export const logoWidthDesktop = 161;
export const logoWidthMobile = 49;

export const styles = (theme: Theme) => ({
  drawerContainer: {
    backgroundColor: "white",
    display: "flex",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  appBar: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {},
  },
  toolbar: {
    justifyContent: "space-between",
    minHeight: toolbarHeightDesktop,
    [theme.breakpoints.down("sm")]: {
      minHeight: toolbarHeightMobile,
    },
  },

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  sidebarNavigationLink: {
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
  sidebarNavigationSelectedLink: {
    fontWeight: 700,
    "& p": {
      fontWeight: 700,
    },
  },
  card: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  cardContent: {
    minHeight: 80,
  },
  navBarLink: {
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
});
