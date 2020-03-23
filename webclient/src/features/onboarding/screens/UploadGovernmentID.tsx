import { Box, Container, Theme, withStyles, WithStyles } from "@material-ui/core";
import { DropzoneFile } from "dropzone";
import React from "react";
import { RouteComponentProps } from "react-router";
import {
  Button,
  Dropzone,
  DropzonePreview,
  InputErrorBox,
  StepsSidebar,
  ToolbarPadding,
  Typography,
} from "../../../common/components";
import DependencyContext from "../../../common/contexts/DependencyContext";
import { styles } from "../../../common/theme";
import { IPFSAddFileResponse } from "../../../libraries/ipfs";
import routes from "../../../routes";
import { MobileAppBar, SidebarNavigation } from "../components";
import { OnboardingRepositoryInjectionKeys } from "../InjectionKeys";

interface Props extends WithStyles, RouteComponentProps {}

const Component: React.FC<Props> = ({ classes, history, ...props }) => {
  const dependencies = React.useContext(DependencyContext);
  const OnboardingRepository = dependencies.provide(OnboardingRepositoryInjectionKeys);
  const [error, setError] = React.useState<Error | null>(null);
  const [isFileUploading, setIsFileUploading] = React.useState(false);
  const [isFileUploadEnd, setIsFileUploadEnd] = React.useState(false);

  const {
    execute: executeUploadGovernmentIDMutation,
  } = OnboardingRepository.useUploadGovernmentIDMutation();

  const onAddFile = (file: DropzoneFile) => {
    console.log(file);
    setIsFileUploading(true);
    setIsFileUploadEnd(false);
  };

  const onUploadEnd = async (response: IPFSAddFileResponse[]) => {
    setIsFileUploading(false);
    const [{ hash: fileHash }] = response;
    try {
      await executeUploadGovernmentIDMutation({ args: { fileHash } });
      setIsFileUploadEnd(true);
    } catch (error) {
      setError(error);
    }
  };

  const onContinue = () => {
    history.push(routes.onboarding.setBankAccount);
  };

  return (
    <Box className={classes.drawerContainer}>
      <StepsSidebar>
        <SidebarNavigation history={history} {...props} />
      </StepsSidebar>
      <Container maxWidth="xs">
        <MobileAppBar />
        <ToolbarPadding />
        <Box mb={4}>
          <Typography variant="h5" mb={1}>
            Comprueba tu identidad
          </Typography>
          <Typography>Sube una fotografía o scan de la parte frontal de tu DPI.</Typography>
        </Box>
        <Box mb={4}>
          <Box>
            <Dropzone
              onAddFile={onAddFile}
              onUploadEnd={onUploadEnd}
              message={
                <Typography>
                  Arrastra o selecciona
                  <br />
                  PNG ó JPG
                </Typography>
              }
            />
          </Box>
          <Box mt={2}>
            <DropzonePreview />
          </Box>
        </Box>
        <InputErrorBox error={error} />
        <Box mb={4}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            size="large"
            disabled={isFileUploading || !isFileUploadEnd}
            onClick={onContinue}
          >
            Continuar
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export const UploadGovernmentID = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
