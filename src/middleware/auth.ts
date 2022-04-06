const Jwt = require("jsonwebtoken");
const ApiResponseHandler = require('../helper/ApiResponse.ts')

const config = process.env;

const verifyToken = (req, res, next) => {
    const token =
        req.body.access_token || req.query.access_token || req.headers["access-token"];

    if (!token) {
        const err = "error";
        ApiResponseHandler.sendError(req, res, "Auth Token", err, "A token is required for authentication");
    }
    try {
        const decoded = Jwt.verify(token, config.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        ApiResponseHandler.sendError(req, res, "Auth Token", err, "Invalid Token");
    }
};

module.exports = verifyToken;