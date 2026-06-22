import { Catch, Optional } from "@nestjs/common";
import { ContextAccessor } from "@omnixys/context";
import { ErrorCode } from "@omnixys/contracts";
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

export class BaseGraphQLException extends GraphQLError {
  constructor(
    code: string,
    message: string,
    details: Readonly<Record<string, unknown>> = {},
    compatibilityExtensions: Readonly<Record<string, unknown>> = {},
  ) {
    const safeDetails = sanitizeDetails(details);
    super(message, {
      extensions: {
        ...sanitizeExtensions(compatibilityExtensions),
        code,
        ...errorContext(),
        timestamp: new Date().toISOString(),
        details: safeDetails,
        // Compatibility alias retained for existing Apollo consumers.
        metadata: safeDetails,
      },
    });
  }
}

/** @deprecated Prefer `BaseGraphQLException`. */
export class FrameworkGraphQLException extends BaseGraphQLException {}

export function toGraphQLError(error: unknown): GraphQLError {
  if (error instanceof GraphQLError && !structuredError(error.originalError)) {
    const code = codeOf(error.extensions.code);
    const details = sanitizeDetails(
      recordOf(error.extensions.details) ?? recordOf(error.extensions.metadata),
    );
    return new GraphQLError(error.message, {
      nodes: error.nodes,
      source: error.source,
      positions: error.positions,
      path: error.path,
      originalError: error.originalError,
      extensions: {
        ...sanitizeExtensions(error.extensions),
        code,
        ...errorContext(),
        timestamp: timestampOf(error.extensions.timestamp),
        details,
        metadata: details,
      },
    });
  }
  const structured = structuredError(
    error instanceof GraphQLError ? error.originalError : error,
  );
  const context = errorContext(structured);
  const message = structured?.message ?? messageOf(error);
  const code = structured?.code ?? ErrorCode.INTERNAL_SERVER_ERROR;
  const details = sanitizeDetails(structured?.metadata);

  return new GraphQLError(message, {
    originalError: error instanceof Error ? error : undefined,
    extensions: {
      code,
      ...context,
      timestamp: new Date().toISOString(),
      details,
      metadata: details,
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
        : ErrorCode.INTERNAL_SERVER_ERROR);
    const safeClientError = code !== ErrorCode.INTERNAL_SERVER_ERROR;
    const context = errorContext(structured);
    const details = sanitizeDetails(
      structured?.metadata ??
        recordOf(formatted.extensions?.details) ??
        recordOf(formatted.extensions?.metadata),
    );

    return {
      ...formatted,
      message:
        structured || options.exposeInternalErrors || safeClientError
          ? formatted.message
          : "Internal server error",
      extensions: {
        ...sanitizeExtensions(formatted.extensions),
        code,
        ...context,
        timestamp: timestampOf(formatted.extensions?.timestamp),
        details,
        metadata: details,
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
    requestId: scopedId(error?.requestId) ?? context?.requestId ?? "unscoped",
    correlationId:
      scopedId(error?.correlationId) ??
      context?.correlationId ??
      context?.requestId ??
      "unscoped",
    traceId: scopedId(error?.traceId) ?? context?.trace?.traceId,
    actorId: scopedId(error?.actorId) ?? context?.principal?.actorId,
    tenantId:
      scopedId(error?.tenantId) ??
      context?.tenant?.tenantId ??
      context?.principal?.tenantId,
  };
}

function scopedId(value: string | undefined): string | undefined {
  return value && value !== "unscoped" ? value : undefined;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "Internal server error";
}

const SENSITIVE_DETAIL_KEY =
  /(?:authorization|cookie|password|secret|token|credential|private.?key|api.?key)/i;
const INTERNAL_EXTENSION_KEYS = new Set([
  "exception",
  "originalError",
  "stack",
  "stacktrace",
]);

export function sanitizeDetails(
  details: Readonly<Record<string, unknown>> | undefined,
): Readonly<Record<string, unknown>> {
  if (!details) return {};
  return sanitizeRecord(details, 0, new WeakSet<object>());
}

function sanitizeExtensions(
  extensions: Readonly<Record<string, unknown>> | undefined,
): Readonly<Record<string, unknown>> {
  if (!extensions) return {};
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(extensions)) {
    if (INTERNAL_EXTENSION_KEYS.has(key) || SENSITIVE_DETAIL_KEY.test(key)) {
      continue;
    }
    const sanitized = sanitizeValue(value, 0, new WeakSet<object>());
    if (sanitized !== undefined) safe[key] = sanitized;
  }
  return safe;
}

function sanitizeRecord(
  value: Readonly<Record<string, unknown>>,
  depth: number,
  seen: WeakSet<object>,
): Readonly<Record<string, unknown>> {
  if (seen.has(value)) return {};
  seen.add(value);
  const safe: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (SENSITIVE_DETAIL_KEY.test(key)) continue;
    const sanitized = sanitizeValue(entry, depth + 1, seen);
    if (sanitized !== undefined) safe[key] = sanitized;
  }
  return safe;
}

function sanitizeValue(
  value: unknown,
  depth: number,
  seen: WeakSet<object>,
): unknown {
  if (depth > 5) return "[truncated]";
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) {
    return value
      .slice(0, 50)
      .map((entry) => sanitizeValue(entry, depth + 1, seen))
      .filter((entry) => entry !== undefined);
  }
  if (value && typeof value === "object") {
    return sanitizeRecord(value as Readonly<Record<string, unknown>>, depth, seen);
  }
  return undefined;
}

function recordOf(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Readonly<Record<string, unknown>>)
    : undefined;
}

function codeOf(value: unknown): string {
  return typeof value === "string" ? value : ErrorCode.INTERNAL_SERVER_ERROR;
}

function timestampOf(value: unknown): string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value))
    ? value
    : new Date().toISOString();
}
