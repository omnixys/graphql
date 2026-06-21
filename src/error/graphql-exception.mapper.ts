import { Catch, Optional } from "@nestjs/common";
import { ContextAccessor } from "@omnixys/context";
import { GqlExceptionFilter } from "@nestjs/graphql";
import { OmnixysLogger } from "@omnixys/logger";
import { GraphQLError, type GraphQLFormattedError } from "graphql";

export interface FrameworkErrorLike {
  readonly code: string;
  readonly message: string;
  readonly requestId?: string;
  readonly correlationId?: string;
  readonly traceId?: string;
  readonly actorId?: string;
  readonly tenantId?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface GraphQLExceptionMappingOptions {
  readonly exposeInternalErrors?: boolean;
}

export class FrameworkGraphQLException extends GraphQLError {
  constructor(
    code: string,
    message: string,
    metadata: Readonly<Record<string, unknown>> = {},
    compatibilityExtensions: Readonly<Record<string, unknown>> = {},
  ) {
    super(message, {
      extensions: {
        code,
        ...errorContext(),
        metadata,
        ...compatibilityExtensions,
      },
    });
  }
}

export function toGraphQLError(error: unknown): GraphQLError {
  if (error instanceof GraphQLError && !structuredError(error.originalError)) {
    return new GraphQLError(error.message, {
      nodes: error.nodes,
      source: error.source,
      positions: error.positions,
      path: error.path,
      originalError: error.originalError,
      extensions: {
        ...error.extensions,
        ...errorContext(),
      },
    });
  }
  const structured = structuredError(
    error instanceof GraphQLError ? error.originalError : error,
  );
  const context = errorContext(structured);
  const message = structured?.message ?? messageOf(error);
  const code = structured?.code ?? "INTERNAL_SERVER_ERROR";

  return new GraphQLError(message, {
    originalError: error instanceof Error ? error : undefined,
    extensions: {
      code,
      ...context,
      metadata: structured?.metadata ?? {},
    },
  });
}

export function createGraphQLFormatError(
  options: GraphQLExceptionMappingOptions = {},
): (formatted: GraphQLFormattedError, error: unknown) => GraphQLFormattedError {
  return (formatted, error) => {
    const graphQLError = error instanceof GraphQLError ? error : undefined;
    const structured = structuredError(graphQLError?.originalError ?? error);
    const code =
      structured?.code ??
      (typeof formatted.extensions?.code === "string"
        ? formatted.extensions.code
        : "INTERNAL_SERVER_ERROR");
    const safeClientError = code !== "INTERNAL_SERVER_ERROR";
    const context = errorContext(structured);

    return {
      ...formatted,
      message:
        structured || options.exposeInternalErrors || safeClientError
          ? formatted.message
          : "Internal server error",
      extensions: {
        ...formatted.extensions,
        code,
        ...context,
        metadata: structured?.metadata ?? formatted.extensions?.metadata ?? {},
      },
    };
  };
}

export function createFrameworkGraphQLError(
  code: string,
  message: string,
  metadata: Readonly<Record<string, unknown>> = {},
  compatibilityExtensions: Readonly<Record<string, unknown>> = {},
): GraphQLError {
  return new FrameworkGraphQLException(
    code,
    message,
    metadata,
    compatibilityExtensions,
  );
}

@Catch()
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  constructor(@Optional() private readonly logger?: OmnixysLogger) {}

  catch(exception: unknown): GraphQLError {
    const mapped = toGraphQLError(exception);
    this.logger
      ?.child(GraphQLExceptionFilter.name)
      .error("GraphQL resolver failed", {
        code: mapped.extensions.code,
        error: exception,
      });
    return mapped;
  }
}

function structuredError(value: unknown): FrameworkErrorLike | undefined {
  if (!value || typeof value !== "object") return undefined;
  const candidate = value as Partial<FrameworkErrorLike>;
  return typeof candidate.code === "string" &&
    typeof candidate.message === "string"
    ? (candidate as FrameworkErrorLike)
    : undefined;
}

function errorContext(error?: FrameworkErrorLike) {
  const context = ContextAccessor.get();
  return {
    requestId: error?.requestId ?? context?.requestId ?? "unscoped",
    correlationId:
      error?.correlationId ??
      context?.correlationId ??
      context?.requestId ??
      "unscoped",
    traceId: error?.traceId ?? context?.trace?.traceId,
    actorId: error?.actorId ?? context?.principal?.actorId,
    tenantId:
      error?.tenantId ??
      context?.tenant?.tenantId ??
      context?.principal?.tenantId,
  };
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "Internal server error";
}
