const FormatError = require("easygraphql-format-error");

const formatError = new FormatError([
  {
    name: "INVALID_EMAIL",
    message: "The email is not valid",
    statusCode: 500
  },
  {
    name: "NO_USER_WITH_THAT_ID",
    message: "No user with that id",
    statusCode: 500
  },
  {
    name: "EMAIL_IS_ALREADY_REGISTERED",
    message: "This email is already registered",
    statusCode: 500
  },
  {
    name: "NO_USER_WITH_THAT_EMAIL",
    message: "No user with that email",
    statusCode: 500
  },
  {
    name: "INCORRECT_PASSWORD",
    message: "Incorrect password",
    statusCode: 500
  },
  {
    name: "NO_USER_FOUND",
    message: "No user found",
    statusCode: 500
  },
  {
    name: "UNAUTHORIZED",
    message: "You are not authorized",
    statusCode: 401
  }
]);

module.exports = formatError;
