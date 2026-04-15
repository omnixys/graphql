import { DynamicModule, Global, Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloFederationDriver } from "@nestjs/apollo";
import "./graphql.enums.bootstrap.js";
import { createGraphQLConfig } from "./graphql.options.js";

@Global()
@Module({})
export class OmnixysGraphQLModule {
  static forRoot(
    overrides?: Parameters<typeof createGraphQLConfig>[0],
  ): DynamicModule {
    return {
      module: OmnixysGraphQLModule,
      imports: [
        GraphQLModule.forRoot({
          driver: ApolloFederationDriver,
          ...createGraphQLConfig(overrides),
        }),
      ],
      exports: [GraphQLModule],
    };
  }
}
