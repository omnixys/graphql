import {
  ContactOptionsType,
  GenderType,
  InterestCategoryType,
  InterestType,
  MaritalStatusType,
  MessageDirectionEnum,
  PersonStatusType,
  PhoneNumberType,
  RealmRoleType,
  RelationshipType,
  StatusType,
  UserType,
} from "@omnixys/contracts";
import { registerEnum } from "./graphql.enums.js";

const enumDefinitions: ReadonlyArray<readonly [string, object]> = [
  ["MessageDirection", MessageDirectionEnum],
  ["ContactOptionsType", ContactOptionsType],
  ["GenderType", GenderType],
  ["InterestType", InterestType],
  ["MaritalStatusType", MaritalStatusType],
  ["PersonStatusType", PersonStatusType],
  ["PhoneNumberType", PhoneNumberType],
  ["RelationshipType", RelationshipType],
  ["StatusType", StatusType],
  ["UserType", UserType],
  ["RealmRoleType", RealmRoleType],
  ["InterestCategoryType", InterestCategoryType],
];

export function registerOmnixysGraphQLEnums(): void {
  for (const [name, enumRef] of enumDefinitions) registerEnum(name, enumRef);
}

// Compatibility: importing the package root continues to register all enums.
registerOmnixysGraphQLEnums();
