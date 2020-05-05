import { Theme } from "@material-ui/core";

export const styles = (theme: Theme) => ({
  drawerContainer: {
    backgroundColor: "white",
    display: "flex",
  },
  tableContainer: {
    maxHeight: "70vh",
  },
  mainContainer: {
    paddingBottom: 6,
    backgroundColor: "whitesmoke",
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
    [theme.breakpoints.down("sm")]: {},
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
    color: "white",
    textDecoration: "none",
  },
  sidebarNavigationSelectedLink: {
    fontWeight: 900,
    "& p": {
      fontWeight: 900,
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
  rowItemBox: {
    display: "flex" as "flex",
    justifyContent: "center" as "center",
    flexDirection: "column" as "column",
    minHeight: 24,
  },
});
