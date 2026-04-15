import { ApolloFederationDriverConfig } from "@nestjs/apollo";
import { GqlFastifyContext } from "@omnixys/context";

export function createGraphQLConfig(
  overrides?: Partial<ApolloFederationDriverConfig>,
): ApolloFederationDriverConfig {
  const SCHEMA_TARGET = "dist";

  const base: ApolloFederationDriverConfig = {
    autoSchemaFile: { path: "dist/schema.gql", federation: 2 },

    sortSchema: true,
    playground: false,
    introspection: true,
    csrfPrevention: false,

    context: ({ req, reply }: GqlFastifyContext) => ({
      req,
      reply,
    }),
  };

  return {
    ...base,
    ...overrides,
  };
}
