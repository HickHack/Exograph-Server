$(document).ready(function () {
    var isNavVisible = false;
    var expandCollapseContainer = $('.expand-collapse-nav');
    var expandCollapseBtn = $('.expand-collapse-nav button');
    var searchBtn = $('.node-search button');
    var helpBtn = $('.help button');
    var caretIcon = $('.expand-collapse-nav button i');
    var sidebar = $('.sidebar');

    var caretRight = 'fa-caret-right';
    var caretLeft = 'fa-caret-left';

    layoutSidebarButton();
    setupSidebarButtonClickHandler();
    setupToolbarBarSearchClick();
    setupHelpButtonClick();

    function setupSidebarButtonClickHandler() {
        expandCollapseBtn.click(function () {
            toggleSidePanel();
        });
    }

    function setupToolbarBarSearchClick() {
        searchBtn.click(function () {
            setTimeout(function(){
                $('input[name="query"]').focus();
            }, 1);

            toggleSidePanel();
        });
    }

    function setupHelpButtonClick() {
        helpBtn.click(function () {
            $('#helpModal').modal("show");
        });
    }

    function toggleSidePanel() {
        if (isNavVisible) {
            sidebar.hide();
        } else {
            sidebar.show();
        }

        isNavVisible = !isNavVisible;
        layoutSidebarButton();
    }

    function layoutSidebarButton() {
        expandCollapseContainer.css("margin-left", 0);

        if (isNavVisible) {
            caretIcon.removeClass(caretRight);
            caretIcon.addClass(caretLeft);
            expandCollapseContainer.css("margin-top", (sidebar.height() / 2) - expandCollapseBtn.height() / 2 + 20);
            expandCollapseContainer.css("margin-left", sidebar.width());
        } else {
            caretIcon.removeClass(caretLeft);
            caretIcon.addClass(caretRight);
        }

        expandCollapseBtn.blur();

    }


});

var ButtonOptions = {

    togglePauseIcon: function (isPaused) {
        var button = $(".pause-viz button");
        var icon = button.find("i");

        if (isPaused) {
            icon.removeClass("fa-pause");
            icon.addClass("fa-play");
        } else {
            icon.removeClass("fa-play");
            icon.addClass("fa-pause");
        }

        button.blur();
    },
    toggleFocusIcon: function (isFocused) {
        var button = $(".focus-highlight button");
        var icon = button.find("i");

        if (isFocused) {
            icon.removeClass("fa-dot-circle-o");
            icon.addClass("fa-times-circle-o");
        } else {
            icon.removeClass("fa-times-circle-o");
            icon.addClass("fa-dot-circle-o");
        }

        button.blur();
    },
    toggleLockIcon: function (isLocked) {
        var button = $(".lock-node button");
        var icon = button.find("i");

        if (isLocked) {
            icon.removeClass("fa-lock");
            icon.addClass("fa-unlock");
        } else {
            icon.removeClass("fa-unlock");
            icon.addClass("fa-lock");
        }

        button.blur();
    }
};