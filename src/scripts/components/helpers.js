var timeZoneOffsetHours = new Date().getTimezoneOffset() / 60;

// Seconds since Unix Epoch. Used to convert between the database
// timestamp and client JS timestamp. However it is much easier to
// just do it in postgresql queries, as they have a lot of good 
// date/time functions.
function getCurrUnixTime() {
    return Math.floor((new Date().getTime()) / 1000);
}

function convertToHHMI(unix_time) {
    var days = Math.floor(unix_time / 86400);
    var hours = Math.floor((unix_time - (days * 86400)) / 3600);
    var minutes = Math.floor((unix_time - ((hours * 3600) + (days * 86400))) / 60);
    hours -= timeZoneOffsetHours;
    if (hours < 0) {
        hours = 24 + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }

    return hours + ':' + minutes;
}