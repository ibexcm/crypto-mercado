import gql from "graphql-tag";

export const VerifyPhoneNumberMutation = gql`
  mutation VerifyPhoneNumberMutation($number: String!, $code: String!) {
    verifyPhoneNumber(number: $number, code: $code) {
      token
      expiresAt
    }
  }
`;
