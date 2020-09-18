'use strict';

const createDateHelper = require('../index/dateHelper');

describe('Date Helper', () => {
    describe('isBetween', () => {
        it('should compare a date between 2 dates', () => {
            const dateHelper = createDateHelper();
            const dateToCompare = `2020-01-01T13:30:00.000Z`;
            const start = `2020-01-01T01:30:00.000Z`;
            const end = `2020-01-01T23:30:00.000Z`;
            const result = dateHelper.isBetween(dateToCompare, start, end);
            expect(result).toEqual(true);
        });
        it('should compare a date not between 2 dates', () => {
            const dateHelper = createDateHelper();
            const dateToCompare = `2019-01-01T13:30:00.000Z`;
            const start = `2020-01-01T01:30:00.000Z`;
            const end = `2020-01-01T23:30:00.000Z`;
            const result = dateHelper.isBetween(dateToCompare, start, end);
            expect(result).toEqual(false);
        });
    });
    describe('getFullTime', () => {
        it('should get the full 24-hour time for a date', () => {
            const dateHelper = createDateHelper();
            const date = new Date(2020, 6, 10, 3, 20, 45, 885);
            const result = dateHelper.getFullTime(date);
            expect(result).toEqual('03:20:45.885');
        });
    });
    describe('includesToday', () => {
        it('should check if today is included in a provided string list of days', () => {
            const dateHelper = createDateHelper();
            const dayList = '0, 1,2,3,4,5,6';
            const result = dateHelper.includesToday(dayList);
            expect(result).toEqual(true);
        });
        it('should check if today is included in a provided array list of days', () => {
            const dateHelper = createDateHelper();
            const dayList = [0, 1, 2, 3, 4, 5, 6];
            const result = dateHelper.includesToday(dayList);
            expect(result).toEqual(true);
        });
        it('should check if today is included in the default param empty string', () => {
            const dateHelper = createDateHelper();
            const result = dateHelper.includesToday();
            expect(result).toEqual(false);
        });
    });
});
