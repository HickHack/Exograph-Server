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