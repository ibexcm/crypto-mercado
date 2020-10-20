import {} from "@ibexcm/libraries/api";
import {
  Backdrop,
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import lodash from "lodash";
import { DateTime } from "luxon";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import { Button, Sidebar, ToolbarPadding, Typography } from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { KYCRepositoryInjectionKeys } from "../InjectionKeys";

interface Props extends WithStyles, RouteComponentProps<{}, StaticContext> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const KYCRepository = dependencies.provide(KYCRepositoryInjectionKeys);

  const {
    data,
    loading: isAdminGettingUsersQueryLoading,
    error,
    refetch,
  } = KYCRepository.useAdminGetUsersQuery();

  const {
    execute: executeAdminDeleteUserMutation,
    loading: isAdminDeleteUserMutationLoading,
  } = KYCRepository.useAdminDeleteUserMutation();

  const loading = isAdminDeleteUserMutationLoading || isAdminDeleteUserMutationLoading;

  if (loading) {
    return (
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const onDeleteUser = async ({ id }) => {
    try {
      await executeAdminDeleteUserMutation({ args: { id } });
      await refetch();
    } catch (error) {}
  };

  return (
    <Box className={classes.drawerContainer}>
      <Sidebar history={history}></Sidebar>
      <Container maxWidth={false} className={classes.mainContainer}>
        <ToolbarPadding />
        <Box mb={3}>
          <Typography variant="h5">Usuarios</Typography>
        </Box>
        <Paper>
          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader size="small" style={{ minWidth: "200%" }}>
              <TableHead>
                <TableRow>
                  <TableCell>No. de cliente</TableCell>
                  <TableCell>Correo electrónico</TableCell>
                  <TableCell>Fecha de verificación</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Banco</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Cuenta</TableCell>
                  <TableCell>Tipo de cuenta</TableCell>
                  <TableCell>Divisa</TableCell>
                  <TableCell>Fecha de creación</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              {!Boolean(error) && Boolean(data?.adminGetUsers.length > 0) && (
                <TableBody>
                  {data.adminGetUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{lodash.get(user, "account.clientID", "")}</TableCell>
                      <TableCell>
                        {lodash.get(user, "contact.email.0.address", "")}
                      </TableCell>
                      <TableCell>
                        {lodash.get(user, "contact.email.0.verifiedAt", null)
                          ? DateTime.fromISO(
                              lodash.get(user, "contact.email.0.verifiedAt"),
                            ).toLocaleString(DateTime.DATETIME_MED)
                          : null}
                      </TableCell>
                      <TableCell>
                        {lodash.get(
                          user,
                          "profile.documents.guatemala.dpi.0.fileHash",
                          null,
                        ) ? (
                          <a
                            href={`https://ipfs.infura.io/ipfs/${lodash.get(
                              user,
                              "profile.documents.guatemala.dpi.0.fileHash",
                            )}`}
                            target="_blank"
                            rel="nofollow"
                          >
                            ver
                          </a>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {lodash.get(user, "bankAccounts.0.guatemala.bank.name", "")}
                      </TableCell>
                      <TableCell>
                        {lodash.get(user, "bankAccounts.0.guatemala.fullName", "")}
                      </TableCell>
                      <TableCell>
                        {lodash.get(user, "bankAccounts.0.guatemala.accountNumber", "")}
                      </TableCell>
                      <TableCell>
                        {lodash.get(user, "bankAccounts.0.guatemala.bankAccountType", "")}
                      </TableCell>
                      <TableCell>
                        {lodash.get(user, "bankAccounts.0.currency.symbol", "")}
                      </TableCell>
                      <TableCell>
                        {lodash.get(user, "account.createdAt", null)
                          ? DateTime.fromISO(
                              lodash.get(user, "account.createdAt"),
                            ).toLocaleString(DateTime.DATE_SHORT)
                          : null}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => {
                            onDeleteUser(user);
                          }}
                        >
                          Borrar Usuario
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export const Users = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
