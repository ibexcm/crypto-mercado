import { useQuery } from "@apollo/client";
import { UserQuery } from "@ibexcm/libraries/api/user";
import { Query } from "../../../libraries/api";
import { AuthTokenRepository } from "../../authentication/repositories/AuthTokenRepository";

export class UserRepository {
  private AuthTokenRepository: AuthTokenRepository;

  constructor(AuthTokenRepository: AuthTokenRepository) {
    this.AuthTokenRepository = AuthTokenRepository;
  }

  useUserQuery() {
    return useQuery<Pick<Query, "user">>(UserQuery, {
      fetchPolicy: "cache-and-network",
    });
  }
}
