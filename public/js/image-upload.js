(function () {
    var form = $("#uploadImage");
    var message = $("#message");

    form.on('submit', (function (e) {
        e.preventDefault();
        message.empty();

        $.ajax({
            url: form.attr('action'),
            type: form.attr('method'),
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                loading.hide();
                message.html(data);
            }
        });
    }));

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
    }

}).call(this);