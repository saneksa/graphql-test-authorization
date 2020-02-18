const jwt = require("jsonwebtoken");

require("dotenv").config();

function verifyJWT_MW(request, response, next) {
  var authHeader = request.headers["authorization"];
  if (authHeader) {
    var bearerToken = authHeader.split(" ");
    if (bearerToken.length == 2 && bearerToken[0].toLowerCase() == "bearer") {
      jwt.verify(bearerToken[1], process.env.JWT_SECRET, function(
        error,
        decodedToken
      ) {
        if (error) {
          return response.status(401).json({
            name: "NOT_VALID_TOKEN",
            message: "Invalid authorization token",
            statusCode: 401
          });
        }

        request.decodedToken = decodedToken;
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

module.exports = {
  verifyJWT_MW
};
