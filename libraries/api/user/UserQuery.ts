import gql from "graphql-tag";

export const UserQuery = gql`
  query UserQuery {
    user {
      id
      role {
        type
      }
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
`;
