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
import { RouteComponentProps } from "react-router";
import {
  Button,
  Sidebar,
  TextField,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { AdminKycApproveUserGovernmentIdInput } from "../../../libraries/api";
import routes from "../../../routes";
import { UserRepositoryInjectionKeys } from "../../user/InjectionKeys";
import { KYCRepositoryInjectionKeys } from "../InjectionKeys";

interface Props extends WithStyles, RouteComponentProps<{ id: string }> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const UserRepository = dependencies.provide(UserRepositoryInjectionKeys);
  const KYCRepository = dependencies.provide(KYCRepositoryInjectionKeys);
  const [error, setError] = React.useState<Error | null>(null);
  const [governmentIDInput, setGovernmentIDInput] = React.useState<
    AdminKycApproveUserGovernmentIdInput
  >({
    id: "",
    CUI: "",
    dateOfBirth: "",
    expiresAt: "",
    firstName: "",
    genre: "",
    lastName: "",
  });

  const {
    data,
    loading,
    error: adminGetUserQueryError,
  } = UserRepository.useAdminGetUserQuery({
    args: { id: match.params.id },
  });

  const {
    execute: executeAdminKYCApproveUserMutation,
    loading: isAdminKYCApproveUserLoading,
  } = KYCRepository.useAdminKYCApproveUserMutation();

  if (loading || isAdminKYCApproveUserLoading) {
    return (
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const onSetGovernmentIDInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: keyof AdminKycApproveUserGovernmentIdInput,
  ) => {
    const value = event.target.value;
    setGovernmentIDInput((prev) => {
      governmentIDInput[key] = value;
      return {
        ...prev,
        ...governmentIDInput,
      };
    });
  };

  const onAdminKYCApproveUser = async (documentID: string, bankAccountID: string) => {
    setError(null);
    try {
      await executeAdminKYCApproveUserMutation({
        userArgs: { id: match.params.id },
        governmentIDArgs: {
          ...governmentIDInput,
          id: documentID,
        },
        bankAccountArgs: {
          id: bankAccountID,
        },
      });
      history.push(routes.kyc.approval);
    } catch (error) {
      setError(error);
    }
  };

  const getValue = (...args) => args.filter(Boolean)[0] || undefined;

  const {
    adminGetUser: { profile, bankAccounts },
  } = data;

  const [bankAccount] = bankAccounts;

  const [document] = profile.documents.guatemala.dpi;

  return (
    <Box className={classes.drawerContainer}>
      <Sidebar history={history}></Sidebar>
      <Container maxWidth={false} className={classes.mainContainer}>
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
                  <Typography>{bankAccount.guatemala.fullName}</Typography>
                </Box>
                <Box mb={1}>
                  <Typography variant="h6">Número de cuenta</Typography>
                  <Typography>{bankAccount.guatemala.accountNumber}</Typography>
                </Box>
                <Box mb={1}>
                  <Typography variant="h6">Tipo de cuenta</Typography>
                  <Typography>{bankAccount.guatemala.bankAccountType}</Typography>
                </Box>
              </Grid>
              <Grid item lg={4}>
                <Box mb={1}>
                  <Typography variant="h6">Banco</Typography>
                  <Typography>{bankAccount.guatemala.bank.name}</Typography>
                </Box>
                <Box mb={1}>
                  <Typography variant="h6">Divisa</Typography>
                  <Typography>{bankAccount.currency.symbol}</Typography>
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
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onSetGovernmentIDInput(event, "firstName");
                    }}
                    value={getValue(governmentIDInput.firstName, document.firstName)}
                    mb={3}
                  />
                  <TextField
                    fullWidth
                    label="Apellidos"
                    variant="outlined"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onSetGovernmentIDInput(event, "lastName");
                    }}
                    value={getValue(governmentIDInput.lastName, document.lastName)}
                    mb={3}
                  />
                  <TextField
                    fullWidth
                    label="CUI"
                    variant="outlined"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onSetGovernmentIDInput(event, "CUI");
                    }}
                    value={getValue(governmentIDInput.CUI, document.CUI)}
                  />
                </Grid>
                <Grid item lg={4}>
                  <TextField
                    fullWidth
                    label="Fecha de nacimiento"
                    placeholder="yyyy-mm-dd"
                    variant="outlined"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onSetGovernmentIDInput(event, "dateOfBirth");
                    }}
                    value={getValue(governmentIDInput.dateOfBirth, document.dateOfBirth)}
                    mb={3}
                  />
                  <TextField
                    fullWidth
                    label="Género"
                    variant="outlined"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onSetGovernmentIDInput(event, "genre");
                    }}
                    value={getValue(governmentIDInput.genre, document.genre)}
                    mb={3}
                  />
                  <TextField
                    fullWidth
                    label="Fecha de expiración"
                    placeholder="yyyy-mm-dd"
                    variant="outlined"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      onSetGovernmentIDInput(event, "expiresAt");
                    }}
                    value={getValue(governmentIDInput.expiresAt, document.expiresAt)}
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
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        size="large"
                        disabled={
                          Boolean(document.verifiedAt) && Boolean(bankAccount.verifiedAt)
                        }
                      >
                        Rechazar
                      </Button>
                    </Grid>
                    <Grid item lg={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={
                          Boolean(document.verifiedAt) && Boolean(bankAccount.verifiedAt)
                        }
                        onClick={() => {
                          onAdminKYCApproveUser(document.id, bankAccount.id);
                        }}
                      >
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
