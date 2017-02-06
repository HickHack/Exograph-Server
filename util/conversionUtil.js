var Converter = module.exports = {}

Converter.unixTimeToDateTime = function (unixTime, next) {
    var time = new Date(unixTime * 1000);

    return next(time);
};

Converter.formatDate = function(date, next) {

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
    return next(formatted);
};

function padValue(value) {
    return (value < 10) ? "0" + value : value;
}