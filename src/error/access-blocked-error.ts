import { GraphQLError } from "graphql";

export function accessBlocked(reasons: string[]) {
  return new GraphQLError("Access blocked", {
    extensions: {
      code: "ACCESS_BLOCKED",
      reasons,
    },
  });
}