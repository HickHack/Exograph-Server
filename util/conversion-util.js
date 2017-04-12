var Converter = module.exports = {};

/**
 * This method converts a posix timestamp in seconds
 * to a formatted string date. Unfortunately it can't
 * be done synchronously since it's used in model getters
 * that don't execute asynchronously
 *
 * @param posix
 */
Converter.unixTimeToFormattedTime = function (posix) {
    var time = new Date(posix * 1000);

    return Converter.formatDate(time);
};

Converter.formatDate = function(date) {

    var month = padValue(date.getMonth() + 1);
    var day = padValue(date.getDate());
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = padValue(date.getMinutes());
    var ampm = "AM";

    var intHour = parseInt(hour);

    if (intHour > 12) {
        ampm = "PM";
        hour = intHour - 12;
    } else if (intHour === 0) {
        hour = "12";
    }

    hour = padValue(hour);

    var formatted = month + "-" + day + "-" + year + " " + hour + ":" + minute + " " + ampm;
    return formatted;
};

function padValue(value) {
    return (value < 10) ? "0" + value : value;
}

Converter.timeSince = function(posix) {
    var dateNow = new Date();
    var dateAgo = new Date(posix * 1000);

    var seconds = Math.floor((dateNow - dateAgo) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years ago";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }

    return Math.floor(seconds) + " seconds ago";

};

Converter.base64Decode = function (b64) {
    if (b64 == '') {
        return '';
    }

    var buffer = new Buffer(b64, 'base64');
    return buffer.toString();
};

Converter.booleanToYesOrNo = function (value) {

    if (value) {
        return 'Yes'
    } else {
        return 'No'
    }
};