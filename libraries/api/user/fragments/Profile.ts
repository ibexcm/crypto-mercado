import gql from "graphql-tag";

export const Profile = gql`
  fragment Profile on User {
    profile {
      country {
        id
        phoneNumberCode
      }
      documents {
        guatemala {
          dpi {
            id
            fileHash
            firstName
            lastName
            genre
            CUI
            dateOfBirth
            verifiedAt
            expiresAt
          }
        }
      }
    }
  }
`;
