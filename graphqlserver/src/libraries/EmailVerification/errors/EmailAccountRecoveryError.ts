import { ApolloError } from "apollo-server-errors";

enum EmailAccountRecoveryErrorCode {
  unauthorized = "unauthorized",
  messagesTemporarilyDeffered = "messagesTemporarilyDeffered",
  tooManyConnections = "toManyConnections",
  temporarilyLocalProblem = "temporarilyLocalProblem",
  maximumCreditsExceeded = "maximumCreditsExceeded",
  insufficientLocalStorage = "insufficientLocalStorage",
  mailboxUnavailable = "mailboxUnavailable",
  userDoesNotExists = "userDoesNotExists",
  messageSizeExceeded = "messageSizeExceeded",
  invalidUser = "invalidUser",
  mailRefused = "mailRefused",
}

const unauthorizedError = new ApolloError(
  "Unauthorized Request",
  EmailAccountRecoveryErrorCode.unauthorized,
);

const messagesTemporarilyDefferedError = new ApolloError(
  "Messages are temporarily deferred by recipient server policy",
  EmailAccountRecoveryErrorCode.messagesTemporarilyDeffered,
);

const tooManyConnectionsError = new ApolloError(
  "Recipient's Mailbox Unavailable",
  EmailAccountRecoveryErrorCode.tooManyConnections,
);

const temporarilyLocalProblemError = new ApolloError(
  "Message Failed, Far-end server error",
  EmailAccountRecoveryErrorCode.temporarilyLocalProblem,
);

const maximumCreditsExceededError = new ApolloError(
  "Credit Limit of email per day exceeded",
  EmailAccountRecoveryErrorCode.maximumCreditsExceeded,
);

const insufficientLocalStorageError = new ApolloError(
  "Too many recipients this hour",
  EmailAccountRecoveryErrorCode.insufficientLocalStorage,
);

const mailboxUnavailableError = new ApolloError(
  "User's mailbox was unavailable",
  EmailAccountRecoveryErrorCode.mailboxUnavailable,
);

const userDoesNotExistsError = new ApolloError(
  "Intended Mailbox does not exists in the Recipient server",
  EmailAccountRecoveryErrorCode.userDoesNotExists,
);

const messageSizeExceededError = new ApolloError(
  "The recipients mailbox has exceeded its storage limit",
  EmailAccountRecoveryErrorCode.messageSizeExceeded,
);

const invalidUserError = new ApolloError(
  "Mailbox name is malformed or does not exists",
  EmailAccountRecoveryErrorCode.invalidUser,
);

const mailRefusedError = new ApolloError(
  "Mail Refused",
  EmailAccountRecoveryErrorCode.mailRefused,
);

export const EmailAccountRecoveryError = {
  unauthorizedError,
  messagesTemporarilyDefferedError,
  tooManyConnectionsError,
  temporarilyLocalProblemError,
  maximumCreditsExceededError,
  insufficientLocalStorageError,
  mailboxUnavailableError,
  userDoesNotExistsError,
  messageSizeExceededError,
  invalidUserError,
  mailRefusedError,
};
