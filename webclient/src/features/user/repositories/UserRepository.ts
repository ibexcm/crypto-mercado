import { useQuery } from "@apollo/client";
import { UserQuery } from "@ibexcm/libraries/api/user";
import { AuthTokenRepository } from "../../authentication/repositories/AuthTokenRepository";

export class UserRepository {
  private AuthTokenRepository: AuthTokenRepository;

  constructor(AuthTokenRepository: AuthTokenRepository) {
    this.AuthTokenRepository = AuthTokenRepository;
  }

  useUserQuery() {
    return useQuery(UserQuery, {
      fetchPolicy: "cache-and-network",
    });
  }
}
