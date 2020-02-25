import gql from "graphql-tag";

export const SendPhoneNumberVerificationCodeMutation = gql`
  mutation SendPhoneNumberVerificationCodeMutation(
    $args: SendPhoneNumberVerificationCodeInput!
  ) {
    sendPhoneNumberVerificationCode(args: $args)
  }
`;
