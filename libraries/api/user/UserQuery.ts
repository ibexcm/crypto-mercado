import gql from "graphql-tag";

export const UserQuery = gql`
  query UserQuery {
    user {
      id
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
