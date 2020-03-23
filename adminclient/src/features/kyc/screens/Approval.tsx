import { SendPhoneNumberVerificationCodeInput } from "@ibexcm/libraries/api";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import { Button, Sidebar, ToolbarPadding, Typography } from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { KYCRepositoryInjectionKeys } from "../InjectionKeys";

interface Props
  extends WithStyles,
    RouteComponentProps<{}, StaticContext, SendPhoneNumberVerificationCodeInput> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const KYCRepository = dependencies.provide(KYCRepositoryInjectionKeys);

  return (
    <Box className={classes.drawerContainer}>
      <Sidebar history={history}></Sidebar>
      <Container maxWidth="lg">
        <ToolbarPadding />
        <Box mb={3}>
          <Typography variant="h5">Solicitudes de ingreso</Typography>
          <Typography>
            Usuarios que finalizaron el proceso de creación de cuenta, pendientes de
            aprobación.
          </Typography>
        </Box>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No. de cliente</TableCell>
                <TableCell>Correo electrónico</TableCell>
                <TableCell>Número de teléfono</TableCell>
                <TableCell>Banco</TableCell>
                <TableCell>Tipo de cuenta</TableCell>
                <TableCell>Divisa</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>ClientID</TableCell>
                <TableCell>Correo electrónico</TableCell>
                <TableCell>Número de teléfono</TableCell>
                <TableCell>Banco</TableCell>
                <TableCell>Tipo de cuenta</TableCell>
                <TableCell>Divisa</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary">
                    Evaluar
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Box>
  );
};

export const Approval = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
