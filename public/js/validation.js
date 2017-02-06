function Validator(validationInfo) {
    this.validationInfo = validationInfo;
}

Validator.prototype.validate = function(props, callback) {
    var errors = [];

    for (var prop in this.validationInfo) {
        var val = props[prop];

        this.validateProp(prop, val, function (err) {
            if (err) {
                errors.push(err);
            }
        });
    }

    return callback(errors);
};

Validator.prototype.validateProp = function(prop, val, callback) {
    var info = this.validationInfo[prop];
    var message = info.message;
    var err = null;

    if (!val) {
        if (info.required) {
            err = 'Missing ' + info.key + ' (required).';
            return callback(err);
        } else {
            return;
        }
    }

    if (info.minLength && val.length < info.minLength) {
        err = 'Invalid ' + info.key + ' (too short). ' + message;
        return callback(err);
    }

    if (info.maxLength && val.length > info.maxLength) {
        err = 'Invalid ' + info.key + ' (too long). ' + message;
        return callback(err);
    }

    if (info.pattern && !info.pattern.test(val)) {
        err = 'Invalid ' + info.key + ' (format). ' + message;
        return callback(err);
    }
}
