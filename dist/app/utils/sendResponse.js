"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, responseData) => {
    const { statusCode, success, message, data, token } = responseData;
    res.status(statusCode).json({ success, message, data, token });
};
exports.default = sendResponse;
