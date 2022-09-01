// eslint-disable-next-line import/no-extraneous-dependencies
import * as timeConvert from 'time-convert';

function msToMinutesAndSeconds(duration) {
    const result = timeConvert.ms.to(timeConvert.m, timeConvert.s)(duration);
    const minutes = result[0];
    const seconds = result[1];
    let minutesText = '';
    let secondsText = '';
    let conjunctionText = '';
    if (minutes > 0) {
        minutesText = minutes === 1 ? `${minutes} minute` : `${minutes} minutes`;
    }
    if (seconds > 0) {
        secondsText = seconds === 1 ? `${seconds} second` : `${seconds} seconds`;
    }
    if (minutes > 0 && seconds > 0) {
        conjunctionText = ' and ';
    }
    return `${minutesText}${conjunctionText}${secondsText}` || `0 seconds`;
}

export default msToMinutesAndSeconds;
