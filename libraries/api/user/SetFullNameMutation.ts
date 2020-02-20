import gql from "graphql-tag";

export const SetFullNameMutation = gql`
  mutation SetFullNameMutation($fullName: String!) {
    setFullName(fullName: $fullName)
  }
`;
