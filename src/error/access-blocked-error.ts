import { createFrameworkGraphQLError } from "./graphql-exception.mapper.js";

export function accessBlocked(reasons: string[]) {
  return createFrameworkGraphQLError(
    "ACCESS_BLOCKED",
    "Access blocked",
    { reasons },
    { reasons },
  );
}
