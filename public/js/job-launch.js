var VALIDATION_INFO = {
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
 * Submitting the LinkedIn launch form
 */
$(document).ready(function () {
    var form = $('#job_launch');

    form.submit(function (event) {

        var formData = {
            'importName': $('input[name=importName]').val(),
            'linkedinEmail': $('input[name=linkedinEmail]').val(),
            'linkedinPassword': $('input[name=linkedinPassword]').val(),
        };

        var validator = new Validator(VALIDATION_INFO);
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
                    document.getElementById("job_launch").reset();

                    if (data) {
                        processModal(data);
                    }
                });
            }
        });

        // stop the form from submitting normally
        event.preventDefault();
    });
});

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
