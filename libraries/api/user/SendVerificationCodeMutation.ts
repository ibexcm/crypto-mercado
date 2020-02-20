import gql from "graphql-tag";

export const SendVerificationCodeMutation = gql`
  mutation SendVerificationCodeMutation($number: String!) {
    sendVerificationCode(number: $number)
  }
`;
