import { Theme } from "@material-ui/core";

export const toolbarHeightDesktop = 120;
export const toolbarHeightMobile = 56;
export const logoWidthDesktop = 120;
export const logoWidthMobile = 49;

export const styles = (theme: Theme) => ({
  drawerContainer: {
    backgroundColor: "white",
    display: "flex",
  },
  topContainer: {
    minHeight: "30vh",
    display: "flex" as "flex",
    flexDirection: "column" as "column",
    justifyContent: "flex-end" as "flex-end",
    [theme.breakpoints.down("sm")]: {
      minHeight: "25vh",
    },
  },
  mainContainer: {
    minHeight: "70vh",
    [theme.breakpoints.down("sm")]: {
      minHeight: "75vh",
    },
    backgroundColor: "whitesmoke",
    overflowY: "scroll" as "scroll",
    paddingTop: theme.spacing(3),
    paddingBottom: 98,
  },
  fixedActionsContainer: {
    position: "fixed" as "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    "& > div": {
      minHeight: "auto" as "auto",
    },
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
  warnCard: {
    backgroundColor: theme.palette.warning.light,
  },
  rowItemBox: {
    display: "flex" as "flex",
    justifyContent: "center" as "center",
    flexDirection: "column" as "column",
    minHeight: 48,
  },
});
