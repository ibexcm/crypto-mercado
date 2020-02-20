import gql from "graphql-tag";

export const SendVerificationCodeMutation = gql`
  mutation SendVerificationCodeMutation($args: SendVerificationCodeInput!) {
    sendVerificationCode(args: $args)
  }
`;
