'use strict';

const moment = require('moment');

function createDateHelper() {
    function isBetween(dateInput, dateStart, dateEnd) {
        return moment(dateInput).isBetween(dateStart, dateEnd);
    }

    function getFullTime(date) {
        return moment(date).format('HH:mm:ss.SSS');
    }

    function includesToday(listOfWeekDays) {
        let today = new Date();
        today = today.getDay();
        return listOfWeekDays.includes(today);
    }

    return Object.freeze({
        isBetween,
        getFullTime,
        includesToday
    });
}

module.exports = createDateHelper;
