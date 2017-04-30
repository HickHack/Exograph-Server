$(document).ready(function () {
    var form = $('#passwordReset');
    var message = $('#message');

    form.submit(function (event) {
        event.preventDefault();

        var data = {
            'old-password': form.find('input[name="old-password"]').val(),
            'new-password': form.find('input[name="new-password"]').val(),
            'new-password-confirm': form.find('input[name="new-password-confirm"]').val()
        };

        $.ajax({
            url: form.attr('action'),
            type: form.attr('method'),
            data: data,
            dataType: 'json',
            success: function (data) {
                displayMessage(data);
            }
        });
    });
    
    function displayMessage(data) {
        message.empty();
        message.text(data.message);

        if (message.type == 'success') {
            message.removeClass('alert-danger');
            message.addClass('alert-success');
        } else {
            message.removeClass('alert-success');
            message.addClass('alert-danger');
        }

        message.show();
    }
});