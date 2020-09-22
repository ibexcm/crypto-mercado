import { useQuery } from "@apollo/client";
import { Query, QueryAdminGetUserArgs } from "@ibexcm/libraries/api";
import { AdminGetUserQuery, UserQuery } from "@ibexcm/libraries/api/user";

export class UserRepository {
  useUserQuery() {
    return useQuery<{ user: Query["user"] }>(UserQuery, {
      fetchPolicy: "cache-and-network",
    });
  }

  useAdminGetUserQuery(args: QueryAdminGetUserArgs) {
    return useQuery<Pick<Query, "adminGetUser">>(AdminGetUserQuery, {
      variables: args,
      fetchPolicy: "cache-and-network",
    });
  }
}
