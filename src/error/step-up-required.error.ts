import { createFrameworkGraphQLError } from "./graphql-exception.mapper.js";

export function stepUpRequired(stepUp: string, reasons: string[]) {
  return createFrameworkGraphQLError(
    "STEP_UP_REQUIRED",
    "Step-up authentication required",
    { stepUp, reasons },
    { stepUp, reasons },
  );
}
