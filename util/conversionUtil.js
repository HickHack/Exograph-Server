var Converter = module.exports = {};

/**
 * This method converts a posix timestamp in seconds
 * to a formatted string date. Unfortunately it can't
 * be done synchronously since it's used in model getters
 * that don't execute asynchronously
 *
 * @param posix
 */
Converter.unixTimeToDateTime = function (posix) {
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

Converter.base64Decode = function (b64) {
    if (b64 == '') {
        return '';
    }

    var buffer = new Buffer(b64, 'base64');
    return buffer.toString();
};