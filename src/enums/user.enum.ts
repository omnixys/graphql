import { registerEnumType } from '@nestjs/graphql';
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
} from '@omnixys/contracts';

registerEnumType(ContactOptionsType, {
  name: 'ContactOptionsType',
  description: 'Defines preferred communication channels for a user.',
});

registerEnumType(GenderType, {
  name: 'GenderType',
  description: 'Specifies the gender of a person.',
});

registerEnumType(InterestType, {
  name: 'InterestType',
  description: 'Represents areas of interest associated with a user.',
});

registerEnumType(MaritalStatusType, {
  name: 'MaritalStatusType',
  description: 'Specifies the marital status of a person.',
});

registerEnumType(PersonStatusType, {
  name: 'PersonStatusType',
  description: 'Represents the current lifecycle state of a user.',
});

registerEnumType(PhoneNumberType, {
  name: 'PhoneNumberType',
  description: 'Specifies the type/category of a phone number.',
});

registerEnumType(RelationshipType, {
  name: 'RelationshipType',
  description: 'Defines the type of relationship between two users.',
});

registerEnumType(StatusType, {
  name: 'StatusType',
  description: 'Represents a business or account-related status.',
});

registerEnumType(UserType, {
  name: 'UserType',
  description: 'Specifies the category of a user (customer, employee, guest).',
});

registerEnumType(RealmRoleType, 
  { name: 'RealmRoleType', 
    description: 'Defines the Role of an User.'
  });

  registerEnumType(InterestCategoryType, { 
      name: 'InterestCategoryType',
      description: 'Represents Interest Categories.'
    });
