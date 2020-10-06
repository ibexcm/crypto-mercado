import { isValidEmail } from "@ibexcm/libraries/validation";
import { Box, TextField, Theme, withStyles, WithStyles } from "@material-ui/core";
import React from "react";
import { styles } from "../theme";
import { InputErrorBox } from "./InputErrorBox";

interface Props extends WithStyles {
  value: string;
  error: Error | null;
  parentInputState(email: string): void;
  shouldEmailBeSent(state: boolean): void;
}

const Component: React.FC<Props> = ({
  classes,
  value,
  error,
  parentInputState,
  shouldEmailBeSent,
  ...props
}) => {
  const [inputError, setInputError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!isValidEmail(value)) {
      shouldEmailBeSent(false);
    }
  }, [value]);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = event.target.value;

    if (!isValidEmail(currentValue)) {
      shouldEmailBeSent(false);
      setInputError(new Error("Email Inválido"));
    } else {
      shouldEmailBeSent(true);
      setInputError(null);
    }

    parentInputState(currentValue);
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
          <InputErrorBox error={error || inputError} />
        </Box>
      </Box>
    </>
  );
};

export const EmailInput = withStyles((theme: Theme) => ({
  ...styles(theme),
}))(Component);
