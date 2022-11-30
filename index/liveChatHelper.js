'use strict';

const moment = require('moment-timezone');
const bankHolidays = require('./bank-holidays.json');

function createLiveChatHelper() {
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

    function getOperationalTimesOfDayFromString(stringList) {
        return stringList.split(',');
    }

    function isBankHoliday() {
        return bankHolidays.events.some(x => moment(x.date).isSame(new Date(Date.now()), 'day'));
    }

    function isLiveChatActive(startTimes, endTimes) {
        if (isBankHoliday()) {
            return false;
        }
        const startTimesArray = getOperationalTimesOfDayFromString(startTimes);
        const endTimesArray = getOperationalTimesOfDayFromString(endTimes);
        const today = new Date(Date.now());
        const dayOfWeek = today.getDay(); // Sunday = 0, Saturday = 6.

        if (startTimesArray[dayOfWeek] !== 'false') {
            return timeIsBetween(
                getFullTime(new Date()),
                startTimesArray[dayOfWeek],
                endTimesArray[dayOfWeek]
            );
        }
        return false;
    }

    return Object.freeze({
        isLiveChatActive
    });
}

module.exports = createLiveChatHelper;
