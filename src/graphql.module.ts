import { GraphQLExceptionFilter } from "./error/graphql-exception.mapper.js";
import { registerOmnixysGraphQLEnums } from "./graphql.enums.bootstrap.js";
import { createGraphQLConfig } from "./graphql.options.js";
import {
  ApolloFederationDriver,
  type ApolloFederationDriverConfig,
} from "@nestjs/apollo";
import { type DynamicModule, Global, Module } from "@nestjs/common";
import { GraphQLModule, type GqlModuleAsyncOptions } from "@nestjs/graphql";

@Global()
@Module({})
export class OmnixysGraphQLModule {
  static forRoot(
    overrides?: Parameters<typeof createGraphQLConfig>[0],
  ): DynamicModule {
    registerOmnixysGraphQLEnums();
    return this.create(
      GraphQLModule.forRoot<ApolloFederationDriverConfig>({
        driver: ApolloFederationDriver,
        ...createGraphQLConfig(overrides),
      }),
    );
  }

  static forRootAsync(
    options: GqlModuleAsyncOptions<ApolloFederationDriverConfig>,
  ): DynamicModule {
    registerOmnixysGraphQLEnums();
    const originalFactory = options.useFactory;
    const graphQLModule =
      GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
        ...options,
        driver: ApolloFederationDriver,
        useFactory: originalFactory
          ? async (...args: any[]) =>
              createGraphQLConfig(
                (await originalFactory(
                  ...args,
                )) as Partial<ApolloFederationDriverConfig>,
              )
          : undefined,
      });
    return this.create(graphQLModule);
  }

  private static create(graphQLModule: DynamicModule): DynamicModule {
    return {
      module: OmnixysGraphQLModule,
      imports: [graphQLModule],
      providers: [GraphQLExceptionFilter],
      exports: [GraphQLModule, GraphQLExceptionFilter],
    };
  }
}
