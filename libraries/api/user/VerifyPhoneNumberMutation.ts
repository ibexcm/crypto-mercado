import gql from "graphql-tag";

export const VerifyPhoneNumberMutation = gql`
  mutation VerifyPhoneNumberMutation($args: VerifyPhoneNumberInput!) {
    verifyPhoneNumber(args: $args) {
      token
      expiresAt
    }
  }
`;
