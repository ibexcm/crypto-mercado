import gql from "graphql-tag";

export const SetProfilePictureMutation = gql`
  mutation SetProfilePictureMutation($image: Upload!) {
    setProfilePicture(image: $image)
  }
`;
