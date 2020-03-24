import gql from "graphql-tag";
import { UserRole } from "./fragments";

export const UserQuery = gql`
  query UserQuery {
    user {
      id
      ...UserRole
      account {
        clientID
      }
      contact {
        phoneNumber {
          number
        }
        email {
          address
        }
      }
      profile {
        country {
          id
          phoneNumberCode
        }
      }
      bankAccounts {
        guatemala {
          accountNumber
          bankAccountType
        }
      }
    }
  }
  ${UserRole}
`;
