import gql from "graphql-tag";

export const UploadGovernmentIDMutation = gql`
  mutation UploadGovernmentIDMutation($args: UploadGovernmentIDInput!) {
    uploadGovernmentID(args: $args) {
      token
      expiresAt
    }
  }
`;
