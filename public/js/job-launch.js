var VALIDATION_INFO_LINKEDIN = {
    'importName': {
        key: 'name',
        required: true,
        minLength: 1,
        maxLength: 90,
        pattern: /^[a-zA-Z ]*$/,
        message: 'Import name must be characters only.'
    },
    'linkedinEmail': {
        key: 'email',
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Username must be an email'
    },
    'linkedinPassword': {
        key: 'password',
        required: true
    }
};

var VALIDATION_INFO_TWITTER = {
    'importName': {
        key: 'name',
        required: true,
        minLength: 1,
        maxLength: 90,
        pattern: /^[a-zA-Z ]*$/,
        message: 'Import name must be characters only.'
    },
    'screenName': {
        key: 'screen name',
        required: true,
        minLength: 1,
        maxLength: 40,
        pattern: /^(?!@).+$/,
        message: 'Screen name must not start with @'
    },
};

var keys = {
    'id': 'Job ID',
    'name': 'Name',
    'status': 'Status',
    'type': 'Type',
    'complete': 'Complete',
    'start_time': 'Start Date',
    'error': 'Message'
};

/**
 * Submitting the launch form
 */

$(document).ready(function () {
    var linkedinForm = $('.linkedin_launch');
    var twitterForm = $('.twitter_launch');

    linkedinForm.submit(function (event) {
        event.preventDefault();
        processForm(linkedinForm);
    });
    twitterForm.submit(function (event) {
        event.preventDefault();
        processForm(twitterForm);
    });
});

function processForm(form) {
    var formData = getFormData(form);

    var validator = getValidator(form.attr('data-type'));
    validator.validate(formData, function (errs) {
        if (errs.length > 0) {
            processErrors(errs);
        } else {
            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: formData,
                dataType: 'json',
                encode: true
            }).done(function (data) {
                $('#job_details').empty();
                $('.message-panel').hide();

                if (data) {
                    processModal(data);
                }
            });
        }
    });
}

function getFormData (form) {
    var inputs = form.find('input');
    var formData = {};

    if (inputs && inputs.length) {
        for (var i = 0; i < inputs.length; i++) {
            Object.defineProperty(formData, inputs[i].name,
                {
                    value : inputs[i].value,
                    writable : true,
                    enumerable : true,
                    configurable : true
                });
        }
    }

    return formData;
}

function getValidator(launchType) {
    if (launchType == 'LINKEDIN') {
        return new Validator(VALIDATION_INFO_LINKEDIN);
    }

    return new Validator(VALIDATION_INFO_TWITTER);
}

function processErrors(errors) {
    var items = [];

    for(var err in errors) {
        var item = '<li>' + errors[err] + '</li>';
        items.push(item);
    }

    $('#errors').empty();
    $('#errors').append(items.join(''));
    $('.message-panel').show();
}

function processModal(data) {
    var items = []
    for (var prop in data) {
        if (keys.hasOwnProperty(prop)) {
            var item = '<li><p>' + keys[prop] + ': ' + data[prop] + '</p></li>';
            items.push(item);
        }
    }

    $('#job_details').append(items.join(''));
    $('#jobModal').modal('show');
}
