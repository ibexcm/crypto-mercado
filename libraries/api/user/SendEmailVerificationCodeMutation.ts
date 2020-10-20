import gql from "graphql-tag";

export const SendEmailVerificationCodeMutation = gql`
  mutation SendEmailVerificationCodeMutation($args: SendEmailVerificationCodeInput!) {
    sendEmailVerificationCode(args: $args) {
      token
      expiresAt
    }
  }
`;
