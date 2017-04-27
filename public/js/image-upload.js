$(document).ready(function () {
    var form = $("#uploadImage");
    var message = $("#message");

    form.submit(function (event) {
        event.preventDefault();
        message.empty();

        $.ajax({
            url: form.attr('action'),
            type: form.attr('method'),
            data: new FormData(this),
            dataType: 'json',
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                if (data.message == 'success') {
                    window.location.reload(true);
                } else {
                    message.text(data.message);
                    message.show();
                }
            }
        });
    });

    // Function to preview image after validation
    $(function () {
        $("#file").change(function () {
            $("#message").empty(); // To remove the previous error message

            var file = this.files[0];
            var type = file.type;
            var match = ["image/png"];

            if (type != match[0]) {
                $('#previewing').attr('src', 'http://seowagon.com/theme/simpleX/img/no-image.jpg');
                $("#message").text("Only png format accepted");
                $("#message").show();

                return false;
            } else {
                var reader = new FileReader();
                reader.onload = imageIsLoaded;
                reader.readAsDataURL(this.files[0]);
            }
        });
    });

    function imageIsLoaded(e) {
        $("#file").css("color", "green");
        $('#image_preview').css("display", "block");
        $('#previewing').attr('src', e.target.result);
        message.hide();
    }
});