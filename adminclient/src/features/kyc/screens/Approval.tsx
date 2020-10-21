import { User } from "@ibexcm/libraries/api";
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
import React from "react";
import { generatePath, RouteComponentProps, StaticContext } from "react-router";
import { Button, Sidebar, ToolbarPadding, Typography } from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import routes from "../../../routes";
import { KYCRepositoryInjectionKeys } from "../InjectionKeys";

interface Props extends WithStyles, RouteComponentProps<{}, StaticContext> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const KYCRepository = dependencies.provide(KYCRepositoryInjectionKeys);

  const {
    data,
    loading,
    error,
  } = KYCRepository.useAdminGetUsersWithPendingKYCApprovalQuery();

  if (loading) {
    return (
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  const onEvaluate = (user: User) => {
    history.push(generatePath(routes.kyc.evaluate, { id: user.id }));
  };

  return (
    <Box className={classes.drawerContainer}>
      <Sidebar history={history}></Sidebar>
      <Container maxWidth={false} className={classes.mainContainer}>
        <ToolbarPadding />
        <Box mb={3}>
          <Typography variant="h5">Solicitudes de ingreso</Typography>
          <Typography>
            Usuarios que finalizaron el proceso de creación de cuenta, pendientes de
            aprobación.
          </Typography>
        </Box>
        <Paper>
          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>No. de cliente</TableCell>
                  <TableCell>Correo electrónico</TableCell>
                  <TableCell>Banco</TableCell>
                  <TableCell>Tipo de cuenta</TableCell>
                  <TableCell>Divisa</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              {!Boolean(error) &&
                Boolean(data?.adminGetUsersWithPendingKYCApproval.length > 0) && (
                  <TableBody>
                    {data.adminGetUsersWithPendingKYCApproval.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{user.account.clientID}</TableCell>
                        <TableCell>{user.contact.email[0].address}</TableCell>
                        <TableCell>{user.bankAccounts[0].guatemala.bank.name}</TableCell>
                        <TableCell>
                          {user.bankAccounts[0].guatemala.bankAccountType}
                        </TableCell>
                        <TableCell>{user.bankAccounts[0].currency.symbol}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              onEvaluate(user);
                            }}
                          >
                            Evaluar
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

export const Approval = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
