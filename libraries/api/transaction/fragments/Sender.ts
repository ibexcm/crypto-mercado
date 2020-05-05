import gql from "graphql-tag";
import { Account, BankAccounts, Contact } from "../../user/fragments";

export const Sender = gql`
  fragment Sender on Transaction {
    sender {
      id
      user {
        id
        account {
          ...Account
        }
        contact {
          ...Contact
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
  ${Contact}
`;
