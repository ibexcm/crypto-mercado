import gql from "graphql-tag";

export const Profile = gql`
  fragment Profile on User {
    profile {
      id
      country {
        id
        phoneNumberCode
      }
      documents {
        id
        guatemala {
          id
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
