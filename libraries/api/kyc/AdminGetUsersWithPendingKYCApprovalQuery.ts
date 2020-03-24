import gql from "graphql-tag";

export const AdminGetUsersWithPendingKYCApprovalQuery = gql`
  query AdminGetUsersWithPendingKYCApprovalQuery {
    adminGetUsersWithPendingKYCApproval {
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
        documents {
          guatemala {
            dpi {
              fileHash
            }
          }
        }
      }
      bankAccounts {
        currency {
          name
          symbol
        }
        guatemala {
          accountNumber
          bankAccountType
          fullName
          bank {
            name
          }
        }
      }
    }
  }
`;
