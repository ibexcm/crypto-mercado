import { isValidPhoneNumber } from "@ibexcm/libraries/validation";
import { Box, TextField, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { styles } from "../theme";
import { InputErrorBox } from "./InputErrorBox";

interface Props extends WithStyles {
  value: string;
  error: Error | null;
  parentInputState(phoneNumber: string): void;
  shouldSMSBeSent(state: boolean): void;
}

const Component: React.FC<Props> = ({
  classes,
  value,
  error,
  parentInputState,
  shouldSMSBeSent,
  ...props
}) => {
  const [inputError, setInputError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    try {
      if (!isValidPhoneNumber(value)) {
        shouldSMSBeSent(false);
      }
    } catch (error) {
      shouldSMSBeSent(false);
    }
  }, [value]);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = event.target.value;
    const invalidPhoneNumberError = new Error("Número Inválido");

    try {
      if (!isValidPhoneNumber(currentValue)) {
        shouldSMSBeSent(false);
        setInputError(invalidPhoneNumberError);
      } else {
        shouldSMSBeSent(true);
        setInputError(null);
      }
    } catch (error) {
      setInputError(invalidPhoneNumberError);
    }

    parentInputState(currentValue);
  };

  return (
    <>
      <Box my={3}>
        <TextField
          autoFocus
          fullWidth
          label="Número de teléfono"
          variant="outlined"
          onChange={onChange}
          value={value}
        />
        <Box mt={2}>
          <InputErrorBox error={error || inputError} />
        </Box>
      </Box>
    </>
  );
};

export const PhoneNumberInput = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
