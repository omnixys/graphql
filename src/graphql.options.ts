import type { ApolloFederationDriverConfig } from "@nestjs/apollo";
import type { GqlFastifyContext } from "@omnixys/context";
import { createGraphQLFormatError } from "./error/graphql-exception.mapper.js";

export function createGraphQLConfig(
  overrides: Partial<ApolloFederationDriverConfig> = {},
): ApolloFederationDriverConfig {
  const base: ApolloFederationDriverConfig = {
    autoSchemaFile: { path: "dist/schema.gql", federation: 2 },
    sortSchema: true,
    playground: false,
    introspection: true,
    csrfPrevention: true,
    debug: false,
    stopOnApplicationShutdown: true,
    inheritResolversFromInterfaces: true,
    formatError: createGraphQLFormatError(),
    context: ({ req, reply }: GqlFastifyContext) => ({ req, reply }),
  };

  return {
    ...base,
    ...overrides,
    buildSchemaOptions: {
      ...base.buildSchemaOptions,
      ...overrides.buildSchemaOptions,
    },
  };
}
