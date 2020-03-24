import { useQuery } from "@apollo/client";
import { AdminGetUserQuery } from "@ibexcm/libraries/api/user";
import { Query, QueryAdminGetUserArgs } from "../../../libraries/api";

export class UserRepository {
  useAdminGetUserQuery(args: QueryAdminGetUserArgs) {
    return useQuery<Pick<Query, "adminGetUser">>(AdminGetUserQuery, {
      variables: args,
      fetchPolicy: "cache-and-network",
    });
  }
}
