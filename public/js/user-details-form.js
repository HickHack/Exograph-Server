
$(document).ready(function () {

    var VALIDATION_INFO = {
        'firstname': {
            key: 'Firstname',
            required: true,
            minLength: 1,
            pattern: /^[A-Za-z]+$/,
            message: 'Firstname must be characters only.'
        },
        'surname': {
            key: 'Surname',
            required: true,
            minLength: 1,
            pattern: /^[A-Za-z]+$/,
            message: 'Surname must be characters only.'
        },
        'company': {
            key: 'Company',
            required: true,
            minLength: 1,
            maxLength: 20,
            pattern: /^[A-Za-z0-9_]+$/,
            message: 'Company must be letters or numbers only.'
        },
        'country': {
            key: 'Country',
            required: true,
            minLength: 1,
            maxLength: 40,
            pattern: /^[A-Za-z]+$/,
            message: 'Country must be letters or numbers only.'
        }
    };

    var form = $('.user-details-form');

    form.submit(function (event) {
        event.preventDefault();
        processForm();
    });

    function processForm () {
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

        validateForm(formData);
    }

    function validateForm(data) {
        var validator = new Validator(VALIDATION_INFO);
        validator.validate(data, function (errs) {
            if (errs.length > 0) {
                processMessages(errs, 'alert-danger');
            } else {
                $.ajax({
                    type: form.attr('method'),
                    url: form.attr('action'),
                    data: data,
                    dataType: 'json',
                    encode: true
                }).done(function (data) {
                    if (data) {
                        processMessages(data.message, 'alert-success');
                    }
                });
            }
        });
    }

    function processMessages(message, alertType) {
        var item = $("<p/>").text(message);

        var container = $('.message-panel');
        var child = $('#message');
        child.empty();
        child.append(item);

        container.find('.alert').removeClass("alert-danger").addClass(alertType);
        container.show();
    }
});