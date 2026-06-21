import { registerEnumType } from "@nestjs/graphql";

const registered = new Map<string, object>();

export function registerEnum(name: string, enumRef: object): void {
  const existing = registered.get(name);
  if (existing === enumRef) return;
  if (existing) {
    throw new Error(`GraphQL enum name "${name}" is already registered`);
  }

  registerEnumType(enumRef, { name });
  registered.set(name, enumRef);
}

export function getRegisteredGraphQLEnumNames(): readonly string[] {
  return Object.freeze([...registered.keys()]);
}
