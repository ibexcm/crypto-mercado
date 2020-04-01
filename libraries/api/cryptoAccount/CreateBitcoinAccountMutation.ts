import gql from "graphql-tag";

export const CreateBitcoinAccountMutation = gql`
  mutation CreateBitcoinAccountMutation($args: CreateBitcoinAccountInput!) {
    createBitcoinAccount(args: $args)
  }
`;
