import { registerEnumType } from "@nestjs/graphql";

const registered = new Set<string>();

export function registerEnum(name: string, enumRef: object) {
  if (registered.has(name)) return;

  registerEnumType(enumRef, { name });
  registered.add(name);
}
