import { isValidPhoneNumber } from "@ibexcm/libraries/validation";
import { Box, TextField, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { styles } from "../theme";
import { InputErrorBox } from "./InputErrorBox";

interface Props extends WithStyles {
  value: string;
  setParentInput(number: string): void;
  error: Error | null;
}

const Component: React.FC<Props> = ({
  classes,
  value,
  setParentInput,
  error,
  ...props
}) => {
  const [inputError, setInputError] = React.useState<Error | null>(null);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const invalidPhoneNumberError = new Error("Número Inválido");

    try {
      if (!isValidPhoneNumber(value)) {
        setInputError(invalidPhoneNumberError);
      } else {
        setInputError(null);
      }
    } catch (error) {
      setInputError(invalidPhoneNumberError);
    }

    setParentInput(value);
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
          <InputErrorBox error={inputError || error} />
        </Box>
      </Box>
    </>
  );
};

export const PhoneNumberInput = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
