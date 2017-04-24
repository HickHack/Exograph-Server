$(document).ready(function () {
    var isNavVisible = false;
    var btnContainer = $('.expand-collapse-nav');
    var button = $('.expand-collapse-nav button');
    var icon = $('.expand-collapse-nav button i');
    var sidebar = $('.sidebar');

    var caretRight = 'fa-caret-right';
    var caretLeft = 'fa-caret-left';

    setupButtonClickHandler();
    layoutButton();
    
    function setupButtonClickHandler() {
        button.click(function () {
            if (isNavVisible) {
                $('.sidebar').hide();
            } else {
                $('.sidebar').show();
            }

            isNavVisible = !isNavVisible;
            layoutButton();
        });
    }
    
    function layoutButton() {
        btnContainer.css("margin-left", 0);

        if (isNavVisible) {
            icon.removeClass(caretRight);
            icon.addClass(caretLeft);
            btnContainer.css("margin-top", (sidebar.height() / 2) - button.height() / 2 + 20);
            btnContainer.css("margin-left", sidebar.width());
        } else {
            icon.removeClass(caretLeft);
            icon.addClass(caretRight);
        }
    }
});