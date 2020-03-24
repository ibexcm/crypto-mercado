import { SendPhoneNumberVerificationCodeInput } from "@ibexcm/libraries/api";
import {
  Backdrop,
  Box,
  Container,
  Grid,
  Paper,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import {
  Button,
  Sidebar,
  TextField,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { UserRepositoryInjectionKeys } from "../../user/InjectionKeys";

interface Props
  extends WithStyles,
    RouteComponentProps<
      { id: string },
      StaticContext,
      SendPhoneNumberVerificationCodeInput
    > {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const UserRepository = dependencies.provide(UserRepositoryInjectionKeys);

  const { data, loading, error } = UserRepository.useAdminGetUserQuery({
    args: { id: match.params.id },
  });

  if (loading) {
    return (
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const {
    adminGetUser: { profile, bankAccounts },
  } = data;

  return (
    <Box className={classes.drawerContainer}>
      <Sidebar history={history}></Sidebar>
      <Container maxWidth="lg" className={classes.mainContainer}>
        <ToolbarPadding />
        <Box mb={3}>
          <Typography variant="h5">Evaluando solicitud de ingreso</Typography>
          <Typography>
            El administrador deberá comprobar la identidad del sujeto. El nombre de la
            cuenta bancaria debe coincidir con el nombre en el DPI.
          </Typography>
        </Box>
        <Paper>
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item lg={4}>
                <Typography variant="overline">DPI</Typography>
              </Grid>
              <Grid item lg={4}>
                <Typography variant="overline">Cuenta bancaria</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item lg={4}>
                <img
                  src={`https://ipfs.infura.io/ipfs/${profile.documents.guatemala.dpi[0].fileHash}`}
                  width="100%"
                  height="auto"
                />
              </Grid>
              <Grid item lg={4}>
                <Box mb={1}>
                  <Typography variant="h6">Titular</Typography>
                  <Typography>{bankAccounts[0].guatemala.fullName}</Typography>
                </Box>
                <Box mb={1}>
                  <Typography variant="h6">Número de cuenta</Typography>
                  <Typography>{bankAccounts[0].guatemala.accountNumber}</Typography>
                </Box>
                <Box mb={1}>
                  <Typography variant="h6">Tipo de cuenta</Typography>
                  <Typography>{bankAccounts[0].guatemala.bankAccountType}</Typography>
                </Box>
              </Grid>
              <Grid item lg={4}>
                <Box mb={1}>
                  <Typography variant="h6">Banco</Typography>
                  <Typography>{bankAccounts[0].guatemala.bank.name}</Typography>
                </Box>
                <Box mb={1}>
                  <Typography variant="h6">Divisa</Typography>
                  <Typography>{bankAccounts[0].currency.symbol}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box mt={2}>
              <Typography mb={3}>
                Complete los campos con la información presentada en el DPI. De ser
                ilegible, rechaze.
              </Typography>
              <Grid container spacing={2}>
                <Grid item lg={4}>
                  <TextField
                    fullWidth
                    autoFocus
                    label="Nombre(s)"
                    variant="outlined"
                    mb={3}
                  />
                  <TextField fullWidth label="Apellidos" variant="outlined" mb={3} />
                  <TextField fullWidth label="CUI" variant="outlined" />
                </Grid>
                <Grid item lg={4}>
                  <TextField
                    fullWidth
                    label="Fecha de nacimiento"
                    placeholder="yyyy-mm-dd"
                    variant="outlined"
                    mb={3}
                  />
                  <TextField fullWidth label="Género" variant="outlined" mb={3} />
                  <TextField
                    fullWidth
                    label="Fecha de expiración"
                    placeholder="yyyy-mm-dd"
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  lg={4}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    flexDirection: "column",
                  }}
                >
                  <Typography mb={3}>
                    Cualquiera de las 2 acciones notificará al usuario. En caso de
                    aprobación, el usuario podrá iniciar sesión.
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item lg={6}>
                      <Button fullWidth variant="outlined" color="primary" size="large">
                        Rechazar
                      </Button>
                    </Grid>
                    <Grid item lg={6}>
                      <Button fullWidth variant="contained" color="primary" size="large">
                        Aprobar
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export const Evaluate = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
