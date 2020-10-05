import { isValidEmail } from "@ibexcm/libraries/validation";
import { Box, TextField, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { styles } from "../theme";
import { InputErrorBox } from "./InputErrorBox";

interface Props extends WithStyles {
  value: string;
  setParentInput(email: string): void;
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

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (!isValidEmail(value)) {
      setInputError(new Error("Email Inválido"));
    } else {
      setInputError(null);
    }

    setParentInput(value);
  };

  return (
    <>
      <Box my={3}>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          type="email"
          value={value}
          onChange={onChange}
        />
        <Box mt={2}>
          <InputErrorBox error={inputError || error} />
        </Box>
      </Box>
    </>
  );
};

export const EmailInput = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
