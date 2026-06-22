import { ErrorCode } from "@omnixys/contracts";
import { BaseGraphQLException } from "./graphql-exception.mapper.js";

export type GraphQLExceptionDetails = Readonly<Record<string, unknown>>;

function withIdentifier(
  key: string,
  value: string | undefined,
  details: GraphQLExceptionDetails,
): GraphQLExceptionDetails {
  return value === undefined ? details : { [key]: value, ...details };
}

export class UserNotFoundException extends BaseGraphQLException {
  constructor(userId?: string, details: GraphQLExceptionDetails = {}) {
    super(
      ErrorCode.USER_NOT_FOUND,
      "User was not found",
      withIdentifier("userId", userId, details),
    );
  }
}

export class UserAlreadyExistsException extends BaseGraphQLException {
  constructor(identifier?: string, details: GraphQLExceptionDetails = {}) {
    super(
      ErrorCode.USER_ALREADY_EXISTS,
      "User already exists",
      withIdentifier("identifier", identifier, details),
    );
  }
}

export class InvalidCredentialsException extends BaseGraphQLException {
  constructor(details: GraphQLExceptionDetails = {}) {
    super(ErrorCode.INVALID_CREDENTIALS, "Invalid credentials", details);
  }
}

export class EventNotFoundException extends BaseGraphQLException {
  constructor(eventId?: string, details: GraphQLExceptionDetails = {}) {
    super(
      ErrorCode.EVENT_NOT_FOUND,
      "Event was not found",
      withIdentifier("eventId", eventId, details),
    );
  }
}

export class EventAlreadyExistsException extends BaseGraphQLException {
  constructor(eventId?: string, details: GraphQLExceptionDetails = {}) {
    super(
      ErrorCode.EVENT_ALREADY_EXISTS,
      "Event already exists",
      withIdentifier("eventId", eventId, details),
    );
  }
}

export class InvitationNotFoundException extends BaseGraphQLException {
  constructor(invitationId?: string, details: GraphQLExceptionDetails = {}) {
    super(
      ErrorCode.INVITATION_NOT_FOUND,
      "Invitation was not found",
      withIdentifier("invitationId", invitationId, details),
    );
  }
}

export class InvitationAlreadyExistsException extends BaseGraphQLException {
  constructor(invitationId?: string, details: GraphQLExceptionDetails = {}) {
    super(
      ErrorCode.INVITATION_ALREADY_EXISTS,
      "Invitation already exists",
      withIdentifier("invitationId", invitationId, details),
    );
  }
}

export class TicketNotFoundException extends BaseGraphQLException {
  constructor(ticketId?: string, details: GraphQLExceptionDetails = {}) {
    super(
      ErrorCode.TICKET_NOT_FOUND,
      "Ticket was not found",
      withIdentifier("ticketId", ticketId, details),
    );
  }
}

export class TicketRevokedException extends BaseGraphQLException {
  constructor(ticketId?: string, details: GraphQLExceptionDetails = {}) {
    super(
      ErrorCode.TICKET_REVOKED,
      "Ticket has been revoked",
      withIdentifier("ticketId", ticketId, details),
    );
  }
}

export class SeatNotFoundException extends BaseGraphQLException {
  constructor(seatId?: string, details: GraphQLExceptionDetails = {}) {
    super(
      ErrorCode.SEAT_NOT_FOUND,
      "Seat was not found",
      withIdentifier("seatId", seatId, details),
    );
  }
}

export class SeatOccupiedException extends BaseGraphQLException {
  constructor(seatId?: string, details: GraphQLExceptionDetails = {}) {
    super(
      ErrorCode.SEAT_OCCUPIED,
      "Seat is already occupied",
      withIdentifier("seatId", seatId, details),
    );
  }
}

export class NotificationNotFoundException extends BaseGraphQLException {
  constructor(notificationId?: string, details: GraphQLExceptionDetails = {}) {
    super(
      ErrorCode.NOTIFICATION_NOT_FOUND,
      "Notification was not found",
      withIdentifier("notificationId", notificationId, details),
    );
  }
}
