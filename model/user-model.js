var errors = require('./../helper/errors');
var hashUtil = require('../util/hash-util');
var network = require('./network-model');
var database = require('./../helper/db');
var neo4j = new database();

// Private constructor:
var User = module.exports = function User(_node) {
    // All we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
};

// Public constants
User.CREATE_VALIDATION_INFO = {
    'firstname': {
        required: true,
        minLength: 1,
        pattern: /^[A-Za-z]+$/,
        message: 'Firstname must be characters only.'
    },
    'surname': {
        required: true,
        minLength: 1,
        pattern: /^[A-Za-z]+$/,
        message: 'Surname must be characters only.'
    },
    'company': {
        required: true,
        minLength: 1,
        maxLength: 20,
        pattern: /^[A-Za-z0-9_]+$/,
        message: 'Company must be letters or numbers only.'
    },
    'country': {
        required: true,
        minLength: 1,
        maxLength: 40,
        pattern: /^[A-Za-z]+$/,
        message: 'Country must be letters or numbers only.'
    },
    'email': {
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Invalid email format.'
    },
    'password': {
        required: true,
        minLength: 6,
        maxLength: 50,
        message: 'Password must be at least 6 characters long'
    }
};

User.UPDATE_VALIDATION_INFO = {
    'firstname': User.CREATE_VALIDATION_INFO.firstname,
    'surname': User.CREATE_VALIDATION_INFO.surname,
    'company': User.CREATE_VALIDATION_INFO.company,
    'country': User.CREATE_VALIDATION_INFO.country
};

User.UPDATE_PASSWORD_VALIDATION_INFO = {
    'newPassword': User.CREATE_VALIDATION_INFO.password
};

// Public instance properties
Object.defineProperties(User.prototype, {
    'id': {
        get: function () {
            return this._node._id;
        }
    },
    'firstname': {
        get: function () {
            return this._node.properties['firstname'];
        }
    },
    'surname': {
        get: function () {
            return this._node.properties['surname'];
        }
    },
    'company': {
        get: function () {
            return this._node.properties['company'];
        }
    },
    'country': {
        get: function () {
            return this._node.properties['country'];
        }
    },
    'email': {
        get: function () {
            return this._node.properties['email'];
        }
    },
    'password': {
        set: function (password) {
            this._node.properties['password'] = hashUtil.generateBcryptKey(password);
        },
        get: function () {
            return this._node.properties['password'];
        }
    },
    'hasProfileImage': {
        set: function (hasProfileImage) {
            this._node.properties['hasProfileImage'] = hasProfileImage;
        },
        get: function () {
            return this._node.properties['hasProfileImage'];
        }
    },
    'profileImagePath': {
        get: function () {
            return '/img/profile/' + this._node._id + '.png';
        }
    }
});

// Private helpers:

// Takes the given caller-provided properties, selects only known ones,
// validates them, and returns the known subset.
// By default, only validates properties that are present.
// (This allows `User.prototype.patch` to not require any.)
// You can pass `true` for `required` to validate that all required properties
// are present too. (Useful for `User.create`.)
function validate(props, validation_info, callback) {
    var safeProps = {};

    for (var prop in validation_info) {
        var val = props[prop];

        validateProp(prop, val, validation_info, function (err) {
            if (err) {
                return callback(err);
            }
        });

        safeProps[prop] = val;
    }

    if (safeProps.password) {
        safeProps.password = hashUtil.generateBcryptKey(safeProps.password);
    }

    return callback(null, safeProps);
}

// Validates the given property based on the validation info above.
// By default, ignores null/undefined/empty values, but you can pass `true` for
// the `required` param to enforce that any required properties are present.
function validateProp(prop, val, validation_info, callback) {
    var info = validation_info[prop];
    var message = info.message;
    var err = undefined;

    if (!val) {
        if (info.required && !skipRequired) {
            err = new errors.ValidationError('Missing ' + prop + ' (required).');
            return callback(err);
        } else {
            return;
        }
    }

    if (info.minLength && val.length < info.minLength) {
        err = new errors.ValidationError('Invalid ' + prop + ' (too short). ' + message);
        return callback(err);
    }

    if (info.maxLength && val.length > info.maxLength) {
        err = new errors.ValidationError('Invalid ' + prop + ' (too long). ' + message);
        return callback(err);
    }

    if (info.pattern && !info.pattern.test(val)) {
        err = new errors.ValidationError('Invalid ' + prop + ' (format). ' + message);
        return callback(err);
    }
}

function isConstraintViolation(err) {
    return err instanceof neo4j.ClientError &&
        err.neo4j.code === 'Neo.ClientError.Schema.ConstraintViolation' ||
        err.neo4j.code === 'Neo.ClientError.Schema.ConstraintValidationFailed';
}

// Public instance methods:

User.prototype.updatePassword = function(passwords, callback) {
    if (!User.isPasswordValid(passwords.oldPassword)){
        return callback(new Error('Old password does not match.'));
    } else if (passwords.newPassword != passwords.newPasswordConfirm) {
        return callback(new Error('Password confirmation does not match.'));
    }

    validate({
        newPassword: passwords.newPassword
    }, User.UPDATE_PASSWORD_VALIDATION_INFO, function (err, props) {
        if (err) {
            callback(err);
        }

        this.password = passwords.newPassword;
        this.patch(function (err) {
            if (err) return callback(new Error('Failed to update password'));
            callback(null);
        })

    });
};

// Atomically updates this user, both locally and remotely in the db, with the
// given property updates.
User.prototype.patch = function (props, callback) {

    var safeProps = validate(props, User.UPDATE_VALIDATION_INFO, function (err, props) {
        if (err) {
            callback(err.message);
        }

        return props;
    });

    var query = [
        'MATCH (user:User {email: {email}})',
        'SET user += {props}',
        'RETURN user',
    ].join('\n');

    var params = {
        email: this.email,
        props: safeProps,
    };

    var self = this;

    neo4j.run({
        query: query,
        params: params
    }, function (err, results) {

        if (err) {
            var error = new Error('Failed failed!');
            return callback(error);
        }

        // Update our node with this updated+latest data from the server:
        self._node = results[0]['user'];

        callback(null);
    });
};

User.prototype.patch = function (callback) {
    var query = [
        'MATCH (user:User {email: {email}})',
        'SET user += {props}',
        'RETURN user',
    ].join('\n');

    var params = {
        email: this.email,
        props: this._node.properties
    };

    neo4j.run({
        query: query,
        params: params
    }, function (err, results) {
        if(err) return callback(err);
        return callback(null);
    });
};

User.prototype.del = function (callback) {
    // Use a Cypher query to delete both this user and his/her following
    // relationships in one query and one network request:
    // (Note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    var query = [
        'MATCH (user:User {username: {username}})',
        'OPTIONAL MATCH (user) -[rel:follows]- (other)',
        'DELETE user, rel',
    ].join('\n')

    var params = {
        username: this.username,
    };

    neo4j.run({
        query: query,
        params: params
    }, function (err) {
        callback(err);
    });
};

User.prototype.follow = function (other, callback) {
    var query = [
        'MATCH (user:User {username: {thisUsername}})',
        'MATCH (other:User {username: {otherUsername}})',
        'MERGE (user) -[rel:follows]-> (other)',
    ].join('\n')

    var params = {
        thisUsername: this.username,
        otherUsername: other.username,
    };

    neo4j.run({
        query: query,
        params: params
    }, function (err) {
        callback(err);
    });
};

User.prototype.getNetworks = function (next) {
    network.getAllByUser(this, function (err, networks) {
        if (err) return next(err);
        return next(null, networks);
    });
};

User.prototype.getNetwork = function (id) {
    return new Promise((resolve, reject) => {
        network.get(id, this, function (err, network) {
            if (err) {
                reject(err);
            } else {
                resolve(network);
            }
        });
    });
};

// Static methods:
User.get = function (id, callback) {
    var query = [
        'MATCH (user:User)',
        'WHERE id(user) = {id}',
        'RETURN user'
    ].join('\n')

    var params = {
        id: parseInt(id),
    };

    neo4j.run({
        query: query,
        params: params
    }, function (err, results) {
        if (err) return callback(err);
        if (!results.length) {
            err = new Error('No such user with id: ' + id);
            return callback(err);
        }

        var user = new User(results[0]['user']);
        callback(null, user);
    });
};

User.getBy = function (field, value, callback) {
    var query = [
        'MATCH (user:User)',
        'WHERE ' + field + ' = {value}',
        'RETURN user'
    ].join('\n')

    var params = {
        value: value
    };

    neo4j.run({
        query: query,
        params: params
    }, function (err, result) {
        if (err) return callback(err);

        if (!result[0]) {
            return callback(null, null);
        } else {
            var user = new User(result[0]['user']);
            return callback(null, user);
        }
    });
};

User.getAll = function (callback) {
    var query = [
        'MATCH (user:User)',
        'RETURN user',
    ].join('\n');

    neo4j.run({
        query: query,
    }, function (err, results) {
        if (err) return callback(err);
        var users = results.map(function (result) {
            return new User(result['user']);
        });
        callback(null, users);
    });
};

User.create = function (props, callback) {
    var success = true;
    var error = null;

    var query = [
        'CREATE (user:User {props})',
        'RETURN user',
    ].join('\n');

    var params = {
        props: validate(props, User.CREATE_VALIDATION_INFO, function (err, props) {
            if (err) {
                success = false;
                error = err;
            }

            return props;
        })
    };

    if (!success && error) {
        return callback(error);
    }

    neo4j.run({
        query: query,
        params: params
    }, function (err, results) {
        if (err != null && isConstraintViolation(err)) {
            // TODO: This assumes username is the only relevant constraint.
            // We could parse the constraint property out of the error message,
            // but it'd be nicer if Neo4j returned this data semantically.
            // Alternately, we could tweak our query to explicitly check first
            // whether the username is taken or not.
            err = new errors.ValidationError(
                'The email ‘' + props.email + '’ is taken.');
        }
        if (err) return callback(err);
        var user = new User(results[0]['user']);
        callback(null, user);
    });
};

User.isPasswordValid = function (password, pass, callback) {
    return hashUtil.bcryptCompare(password, pass, callback);
};

/**
 * Static initialization
 */

//Should be done as a schema migration script
// neo4j.createConstraint('User', 'email', function (err) {
//     if (err) {
//         consol
// });e.warn(err.message);
//     }