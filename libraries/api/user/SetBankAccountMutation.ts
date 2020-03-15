import gql from "graphql-tag";

export const SetBankAccountMutation = gql`
  mutation SetBankAccountMutation($args: SetBankAccountInput!) {
    setBankAccount(args: $args) {
      token
      expiresAt
    }
  }
`;
