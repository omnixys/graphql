import {
  ContactOptionsType,
  GenderType,
  InterestCategoryType,
  InterestType,
  MaritalStatusType,
  PersonStatusType,
  PhoneNumberType,
  RealmRoleType,
  RelationshipType,
  StatusType,
  UserType,
  MessageDirectionEnum,
} from "@omnixys/shared";
import { registerEnum } from './graphql.enums.js';

/**
 * Register enum in GraphQL schema.
 */
registerEnum('MessageDirection',MessageDirectionEnum);
registerEnum('ContactOptionsType', ContactOptionsType);
registerEnum('GenderType', GenderType);
registerEnum('InterestType', InterestType);
registerEnum('MaritalStatusType', MaritalStatusType);
registerEnum('PersonStatusType', PersonStatusType);
registerEnum('PhoneNumberType', PhoneNumberType);
registerEnum('RelationshipType', RelationshipType);
registerEnum('StatusType', StatusType);
registerEnum('UserType', UserType);
registerEnum('RealmRoleType', RealmRoleType);
registerEnum('InterestCategoryType', InterestCategoryType);
