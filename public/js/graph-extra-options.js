$(document).ready(function () {
    var isNavVisible = false;
    var expandCollapseContainer = $('.expand-collapse-nav');
    var expandCollapseBtn = $('.expand-collapse-nav button');
    var exportImageContainer = $('.export-to-image');
    var exportImageBtn = $('.export-to-image button');
    var caretIcon = $('.expand-collapse-nav button i');
    var sidebar = $('.sidebar');

    var caretRight = 'fa-caret-right';
    var caretLeft = 'fa-caret-left';

    layoutSidebarButton();
    layoutImageExportButton();
    setupSidebarButtonClickHandler();
    setupExportButtonClickHandler();

    function setupSidebarButtonClickHandler() {
        expandCollapseBtn.click(function () {
            if (isNavVisible) {
                $('.sidebar').hide();
            } else {
                $('.sidebar').show();
            }

            isNavVisible = !isNavVisible;
            layoutSidebarButton();
        });
    }

    function setupExportButtonClickHandler() {
        exportImageBtn.click(function () {
            $('#exportModal').modal('show');
        });
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
    }
    
    function layoutImageExportButton() {
        exportImageContainer.css("margin-left", $(window).width() / 2 - exportImageContainer.width());
    }
});