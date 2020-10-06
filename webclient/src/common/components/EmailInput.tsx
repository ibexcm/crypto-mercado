import { RecoverAccountEmailInput } from "@ibexcm/libraries/api";
import { isValidEmail } from "@ibexcm/libraries/validation";
import { Box, TextField, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { InputValidationProps } from "../interface/InputValidationProps";
import { styles } from "../theme";
import { InputErrorBox } from "./InputErrorBox";

interface Props
  extends WithStyles,
    InputValidationProps<RecoverAccountEmailInput["address"]> {}

const Component: React.FC<Props> = ({ value, error, onError, onChange }) => {
  const invalidEmailInputError = new Error("Email Inválido");

  React.useEffect(() => {
    if (!Boolean(value)) {
      return;
    }

    if (!isValidEmail(value)) {
      onError(invalidEmailInputError);
      return;
    }

    onError(null);
    onChange(value);
  }, [value]);

  return (
    <Box my={3}>
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        type="email"
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
      />
      <InputErrorBox error={error} />
    </Box>
  );
};

export const EmailInput = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
