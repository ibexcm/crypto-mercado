import gql from "graphql-tag";

export const Account = gql`
  fragment Account on Account {
    id
    clientID
  }
`;
