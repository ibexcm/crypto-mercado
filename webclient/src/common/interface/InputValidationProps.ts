export type InputValidationProps<T> = {
  onError: (error: Error) => void;
  onChange: (value: T) => void;
  value: T;
  error: Error | null;
};
