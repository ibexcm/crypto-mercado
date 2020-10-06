import { RecoverAccountSmsInput } from "@ibexcm/libraries/api";
import { isValidPhoneNumber } from "@ibexcm/libraries/validation";
import { Box, TextField, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { InputValidationProps } from "../interface/InputValidationProps";
import { styles } from "../theme";
import { InputErrorBox } from "./InputErrorBox";

interface Props
  extends WithStyles,
    InputValidationProps<RecoverAccountSmsInput["number"]> {}

const Component: React.FC<Props> = ({ value, error, onError, onChange }) => {
  const invalidPhoneNumberError = new Error("Número Inválido");

  React.useEffect(() => {
    try {
      if (!isValidPhoneNumber(value)) {
        onError(invalidPhoneNumberError);
        return;
      }
    } catch (error) {
      onError(invalidPhoneNumberError);
    }

    onError(null);
    onChange(value);
  }, [value]);

  return (
    <Box my={3}>
      <TextField
        autoFocus
        fullWidth
        label="Número de teléfono"
        variant="outlined"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        value={value}
      />
      <InputErrorBox error={error} />
    </Box>
  );
};

export const PhoneNumberInput = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
