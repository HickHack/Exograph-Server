/**
 * Created by graham on 23/02/17.
 */


// Send item or remove item from trash
$(document).ready(function(){

    // Single action send to trash from dashboard
    $('.job-details').click(function (event) {
        event.preventDefault();

        $.ajax({
            type: 'GET',
            url: $(event.currentTarget).attr('href'),
            contentType: 'application/json',
            success: function (data) {
                populateModal(data);
            },
            error: function (error) {
                console.log(error.responseJSON.error);
            }
        });
    });
    
    function populateModal(model) {
        var ul = $('#job_details');
        ul.empty();

        if (model.message) {
            ul.append(
                $('<li>').text('Something went wrong')
            );

        } else {
            ul.append(
                $('<li>').text('Name: ' + model.name)
            ).append(
                $('<li>').text('Status: ' + model.status)
            ).append(
                $('<li>').text('Completed: ' + model.isComplete)
            ).append(
                $('<li>').text('Successful: ' + model.isSuccess)
            ).append(
                $('<li>').text('Start Time:  ' + model.startTime)
            ).append(
                $('<li>').text('Total Time:  ' + model.totalTime)
            )

        }

        $('#jobModal').modal('show');
    }
});
