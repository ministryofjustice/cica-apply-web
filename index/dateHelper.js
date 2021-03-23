'use strict';

const moment = require('moment-timezone');

function createDateHelper() {
    function isBetween(dateInput, dateStart, dateEnd) {
        return moment
            .utc(dateInput)
            .tz('Europe/London')
            .isBetween(dateStart, dateEnd);
    }
    function timeIsBetween(timeInput, timeStart, timeEnd) {
        const now = moment().format('YYYY-MM-DD');
        const dateInput = moment(`${now}T${timeInput}Z`).tz('Europe/London');
        const dateStart = moment(`${now}T${timeStart}Z`).tz('Europe/London');
        const dateEnd = moment(`${now}T${timeEnd}Z`).tz('Europe/London');

        return isBetween(dateInput, dateStart, dateEnd);
    }

    function getFullTime(date) {
        return moment(date)
            .tz('Europe/London')
            .format('HH:mm:ss.SSS');
    }

    function includesToday(listOfWeekDays = '') {
        let today = new Date();
        today = today.getDay();
        return listOfWeekDays.includes(today);
    }

    return Object.freeze({
        isBetween,
        getFullTime,
        includesToday,
        timeIsBetween
    });
}

module.exports = createDateHelper;
