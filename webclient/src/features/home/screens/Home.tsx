import { SendPhoneNumberVerificationCodeInput } from "@ibexcm/libraries/api";
import { Box, Container, Grid, Theme, withStyles, WithStyles } from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import React from "react";
import { RouteComponentProps, StaticContext } from "react-router";
import { Button, ToolbarPadding, Typography } from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import routes from "../../../routes";
import { OnboardingRepositoryInjectionKeys } from "../../onboarding/InjectionKeys";
import { MobileAppBar } from "../components";

interface Props
  extends WithStyles,
    RouteComponentProps<{}, StaticContext, SendPhoneNumberVerificationCodeInput> {}

const Component: React.FC<Props> = ({ classes, history, location, match, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const OnboardingRepository = dependencies.provide(OnboardingRepositoryInjectionKeys);

  const onCreateAccount = () => {
    OnboardingRepository.reset();
    history.push(routes.onboarding.sendPhoneNumberVerificationCode);
  };

  return (
    <Container maxWidth="xl">
      <MobileAppBar />
      <Box minHeight="85vh" flexDirection="column" display="flex" justifyContent="center">
        <ToolbarPadding />
        <Typography variant="h5" fontWeight={500}>
          Compra/Venta de Bitcoin
        </Typography>
        <Typography variant="h5" fontWeight={500}>
          en Guatemala
        </Typography>
        <Box mb={6} mt={3}>
          <Grid container spacing={1} wrap="nowrap">
            <Grid item>
              <CheckCircleOutlineIcon fontSize="small" color="primary" />
            </Grid>
            <Grid item>
              <Typography fontWeight={500} gutterBottom>
                Hasta 1.5% TRM
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} wrap="nowrap">
            <Grid item>
              <CheckCircleOutlineIcon fontSize="small" color="primary" />
            </Grid>
            <Grid item>
              <Typography fontWeight={500}>
                Depósito a tu cuenta bancaria en USD ó GTQ en menos de 24 horas
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1} wrap="nowrap">
            <Grid item>
              <CheckCircleOutlineIcon fontSize="small" color="primary" />
            </Grid>
            <Grid item>
              <Typography fontWeight={500}>
                Hasta US$10,000.00 de límite de retiro mensual. <sup>[1]</sup>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          size="large"
          onClick={onCreateAccount}
        >
          Crea una cuenta
        </Button>
      </Box>
    </Container>
  );
};

export const Home = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
