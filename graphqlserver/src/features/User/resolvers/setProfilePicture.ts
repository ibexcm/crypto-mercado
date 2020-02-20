import { FileUpload } from "graphql-upload";
import { IContext } from "../../../server/interfaces/IContext";
import { userRepositoryInjectionKey } from "../InjectionKeys";
import { MutationSetProfilePictureArgs } from "@ziina/libraries/api";

export async function setProfilePicture(
  parent,
  { image }: MutationSetProfilePictureArgs,
  { dependencies, request }: IContext,
  info,
): Promise<string> {
  const userRepository = dependencies.provide(userRepositoryInjectionKey);
  return userRepository.setProfilePicture(image, request.auth.user.id);
}
