import { GraphQLError } from "graphql";

export function stepUpRequired(stepUp: string, reasons: string[]) {
  return new GraphQLError("Step-up authentication required", {
    extensions: {
      code: "STEP_UP_REQUIRED",
      stepUp,
      reasons,
    },
  });
}