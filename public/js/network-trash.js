/**
 * Created by graham on 23/02/17.
 */


// Send item or remove item from trash
$(document).ready(function(){

    // Single action send to trash from dashboard
    $('.trash-button').click(function (event) {
        var form = $('.trash-form');

        $.ajax({
            type: form.attr('method'),
            url: form.attr('action')
        }).done(function (data) {

        });

        event.preventDefault();
    });

    // Multi action restore
    $('.restore-button').click(function (event) {
        var form = $('.restore-form');

        submitMultiActionForm(form);
        event.preventDefault();
    });

    // Multi action delete
    $('.delete-button').click(function (event) {
        var form = $('.trash-form');

        submitMultiActionForm(form);
        event.preventDefault();
    });
    
    function submitMultiActionForm(form) {
        var ids =  findSelectedItems();
    }

    function findSelectedItems() {
        var checkboxes = $('tbody input');
        var selectedIds = [];

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                var id = parseInt(checkboxes[i].getAttribute('data-id'));
                selectedIds.push(id);
            }
        }

        return selectedIds;
    }

    //Selecting all checkboxes
    var checkall = $('table .select-all');
    checkall.click(function (event) {

        if (checkall.checked) {
            checkall.checked = false;
            checkAll(false);
        } else {
            checkall.checked = true;
            checkAll(true);
        }

        toggleActionsButton(shouldButtonBeEnabled());
    });
    
    function checkAll(isChecked) {
        var checkboxes = $('tbody input');
        
        checkboxes.each(function (i) {
            checkboxes[i].checked = isChecked;
        });
    }

    //Selecting a checkbox via row click
    var row = $('tbody tr');
    row.click(function (event) {
        var target = $(event.target);
        var checkbox = $(event.currentTarget).find('input').get(0);

        if (!target.hasClass('view-excluded') && !target.hasClass('btn') && !target.hasClass('fa')) {
            toggleCheckbox(checkbox);
        }

        toggleActionsButton(shouldButtonBeEnabled());
    });

    function toggleCheckbox(checkbox) {
        if (checkbox.checked) {
            checkbox.checked = false;
        } else {
            checkbox.checked = true;
        }
    }

    function shouldButtonBeEnabled() {
        var checkboxes = $('tbody input');
        var selectedCount = 0;
        var isEnabled = false;

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                selectedCount++;
                isEnabled = true;
            }
        }
        setSelectedCount(selectedCount, checkboxes.length);

        return isEnabled;
    }

    function toggleActionsButton(isEnabled) {
        var actionsButton = $('.actions-btn');
        if (isEnabled) {
            actionsButton.removeClass('disabled');
        } else {
            actionsButton.addClass('disabled');
        }
    }

    function setSelectedCount(count, total) {
        $('.selected-count').text("Selected (" + count + " / " + total + ")");
    }
});
