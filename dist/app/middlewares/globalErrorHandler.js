"use strict";
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";

    // Construct errorMessages array
    const errorMessages = err.errors ?
        Object.keys(err.errors).map(key => ({
            path: key,
            message: err.errors[key].message
        })) :
        [{
            path: err.path || "",
            message: message
        }];

    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack // Include stack trace only in development
    });
};

module.exports = globalErrorHandler;
