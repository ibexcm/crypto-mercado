import gql from "graphql-tag";
import { Account, BankAccounts } from "../../user/fragments";

export const Recipient = gql`
  fragment Recipient on Transaction {
    recipient {
      id
      user {
        id
        account {
          ...Account
        }
      }
      cryptoAccount {
        id
        currency {
          id
          name
          symbol
        }
        bitcoin {
          id
          address
          xpub
        }
      }
      bankAccount {
        ...BankAccounts
      }
    }
  }
  ${Account}
  ${BankAccounts}
`;
