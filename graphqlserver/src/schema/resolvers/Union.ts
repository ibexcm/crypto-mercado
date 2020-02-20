import { userInputRequestUnionResolver } from "../../features/Dapi/utilities/userInputRequestUnionResolver";

export const Union = {
  SetAddressResponseOrUserInputRequest: userInputRequestUnionResolver("SetAddressResponse"),
  DapiGetAccountsResponseOrUserInputRequest: userInputRequestUnionResolver(
    "DapiGetAccountsResponse",
  ),
};
