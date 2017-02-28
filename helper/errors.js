var util = require('util');

function ValidationError(msg) {
    Error.call(this);
    this.name = 'ValidationError';
    this.message = msg;
    Error.captureStackTrace(this, this.constructor);
}

util.inherits(ValidationError, Error);
exports.ValidationError = ValidationError;

function ConstraintError(msg) {
    Error.call(this);
    this.name = 'ConstraintError';
    this.message = msg;
    Error.captureStackTrace(this, this.constructor);
}

util.inherits(ConstraintError, Error);
exports.ConstraintError = ConstraintError;

function NodeNotFoundError(msg) {
    Error.call(this);
    this.name = 'NodeNotFoundError';
    this.mgs = msg;
    Error.captureStackTrace(this, this.constructor);
}

util.inherits(NodeNotFoundError, Error);
exports.NodeNotFoundError = NodeNotFoundError;

function ErrorResponse(params) {
    var body = {
        error: params.message,
        redirect: params.redirect
    };
    
    this.toJSON = function () {
        return body;
    }
}

exports.ErrorResponse = ErrorResponse;